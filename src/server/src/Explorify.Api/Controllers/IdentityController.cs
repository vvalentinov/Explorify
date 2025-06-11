using Explorify.Api.Extensions;

using Explorify.Persistence.Identity;

using Explorify.Application.Identity;
using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace Explorify.Api.Controllers;

public class IdentityController : BaseController
{
    private readonly IMediator _mediator;

    private readonly SignInManager<ApplicationUser> _signInManager;

    private readonly LinkGenerator _linkGenerator;
    private readonly IIdentityService _identityService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IdentityController(
        IMediator mediator,
        SignInManager<ApplicationUser> signInManager,
        LinkGenerator linkGenerator,
        IHttpContextAccessor httpContextAccessor,
        IIdentityService identityService)
    {
        _mediator = mediator;

        _signInManager = signInManager;
        _linkGenerator = linkGenerator;
        _httpContextAccessor = httpContextAccessor;
        _identityService = identityService;
    }

    [AllowAnonymous]
    [HttpPost(nameof(Login))]
    public async Task<IActionResult> Login(LoginRequestModel model)
    {
        var loginRequestQuery = new LoginQuery(model);

        var loginResult = await _mediator.Send(loginRequestQuery);

        if (loginResult.IsSuccess)
        {
            Response.AppendRefreshTokenCookie(loginResult.Data.RefreshToken);

            return Ok(loginResult.Data.IdentityModel);
        }

        return loginResult.ToProblemDetails();
    }

    [AllowAnonymous]
    [HttpGet(nameof(LoginGoogle))]
    public IActionResult LoginGoogle([FromQuery] string returnUrl)
    {
        var context = _httpContextAccessor.HttpContext;

        if (context is null)
        {
            return Problem("Missing HTTP context.");
        }

        var properties = _signInManager.ConfigureExternalAuthenticationProperties(
        "Google",
            _linkGenerator.GetPathByName(context, nameof(LoginGoogleCallback)) + $"?returnUrl={returnUrl}"
        );

        return Challenge(properties, ["Google"]);
    }

    [AllowAnonymous]
    [HttpGet(nameof(LoginGoogleCallback), Name = nameof(LoginGoogleCallback))]
    public async Task<IActionResult> LoginGoogleCallback([FromQuery] string returnUrl)
    {
        var context = _httpContextAccessor.HttpContext;

        if (context is null)
        {
            return Unauthorized("Missing HTTP context.");
        }

        var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var loginResult = await _identityService.LoginWithGoogleAsync(result.Principal);

        if (!loginResult.IsSuccess)
        {
            return Unauthorized();
        }

        Response.AppendRefreshTokenCookie(loginResult.Data.RefreshToken);

        var identity = loginResult.Data.IdentityModel;

        var queryParams = new Dictionary<string, string?>
        {
            ["accessToken"] = identity.AccessToken,
            ["userId"] = identity.UserId,
            ["userName"] = identity.UserName,
            ["isAdmin"] = identity.IsAdmin.ToString().ToLower(),
            ["profileImageUrl"] = identity.ProfileImageUrl
        };

        var redirectUrl = QueryHelpers.AddQueryString(returnUrl, queryParams);

        return Redirect(redirectUrl);
    }

    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public async Task<IActionResult> Register(RegisterRequestModel model)
    {
        var registerCommand = new RegisterCommand(model);

        var registerResult = await _mediator.Send(registerCommand);

        if (registerResult.IsSuccess)
        {
            Response.AppendRefreshTokenCookie(registerResult.Data.RefreshToken);

            return Ok(registerResult.Data.IdentityModel);
        }

        return registerResult.ToProblemDetails();
    }

    //[AllowAnonymous]
    //[HttpPost(nameof(Refresh))]
    //public async Task<IActionResult> Refresh()
    //{
    //    var refreshToken = Request.Cookies["refreshToken"];

    //    if (string.IsNullOrEmpty(refreshToken))
    //    {
    //        return Unauthorized("Missing refresh token.");
    //    }

    //    var storedToken = await _repository
    //        .All<RefreshToken>()
    //        .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.ExpiresOn > DateTime.UtcNow);

    //    if (storedToken == null)
    //    {
    //        return Unauthorized("Invalid or expired refresh token.");
    //    }

    //    var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
    //    var claims = new List<Claim>
    //    {
    //        new(ClaimTypes.NameIdentifier, user?.Id.ToString() ?? string.Empty),
    //        new(ClaimTypes.Name, user?.UserName ?? string.Empty),
    //    };

    //    var userRoles = await _userManager.GetRolesAsync(user);

    //    foreach (string role in userRoles)
    //    {
    //        claims.Add(new Claim(ClaimTypes.Role, role));
    //    }

    //    var accessToken = _tokenService.GenerateAccessToken(claims);

    //    var response = new IdentityResponseModel
    //    {
    //        AccessToken = accessToken,
    //        UserId = user.Id.ToString(),
    //        UserName = user.UserName ?? string.Empty,
    //        IsAdmin = await _userManager.IsInRoleAsync(user, AdminRoleName),
    //        ProfileImageUrl = user.ProfileImageUrl
    //    };

    //    return Ok(response);
    //}
}
