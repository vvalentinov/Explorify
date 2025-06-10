using Explorify.Api.Extensions;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.User.GetProfileInfo;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.User.Account.ChangeEmail;
using Explorify.Application.User.Account.ConfirmEmail;
using Explorify.Application.User.Account.ResetPassword;
using Explorify.Application.User.Account.ChangeUserName;
using Explorify.Application.User.Account.ChangePassword;
using Explorify.Application.User.Account.ForgotPassword;
using Explorify.Application.UserFollow.GetFollowedUsers;
using Explorify.Application.User.Account.ChangeProfileImage;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Infrastructure;
using Azure.Core;
using System.Web;
using Explorify.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Explorify.Persistence.Identity;
using Explorify.Infrastructure.Services;
using Explorify.Application.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.WebUtilities;
using Explorify.Application.User.Account.ChangeBio;
using Explorify.Application.User.Account.GetBio;

namespace Explorify.Api.Controllers;

public class UserController : BaseController
{
    private readonly IMediator _mediator;

    private readonly IProfileService _profileService;
    private readonly IRepository _repository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly LinkGenerator _linkGenerator;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIdentityService _identityService;

    public UserController(
        IMediator mediator,
        IProfileService profileService,
        IRepository repository,
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        SignInManager<ApplicationUser> signInManager,
        LinkGenerator linkGenerator,
        IHttpContextAccessor httpContextAccessor,
        IIdentityService identityService)
    {
        _mediator = mediator;

        _profileService = profileService;
        _repository = repository;
        _userManager = userManager;
        _tokenService = tokenService;
        _signInManager = signInManager;
        _linkGenerator = linkGenerator;
        _httpContextAccessor = httpContextAccessor;
        _identityService = identityService;
    }

    [HttpPost(nameof(ChangeProfilePicture))]
    public async Task<IActionResult> ChangeProfilePicture([FromUploadProfileImageForm] UploadFile image)
    {
        var command = new ChangeProfileImageCommand(User.GetId().ToString(), image);
        var result = await _mediator.Send(command);
        return Ok(new { imageUrl = result.Data });
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetProfileInfo))]
    public async Task<IActionResult> GetProfileInfo(string? userId)
    {
        if (userId is null && !User.IsAuthenticated())
        {
            var error = new Error("", ErrorType.Validation);
            return this.OkOrProblemDetails(error);
        }

        var resolvedUserId = userId ?? User.GetId().ToString();

        var query = new GetProfileInfoQuery(resolvedUserId, User.GetId());
        var result = await _mediator.Send(query);
        return Ok(result.Data);
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

    [HttpPost(nameof(ChangeUsername))]
    public async Task<IActionResult> ChangeUsername(ChangeUserNameRequestModel model)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new ChangeUserNameCommand(User.GetId(), model.UserName)));

    [HttpPost(nameof(ChangePassword))]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequestModel model)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new ChangePasswordCommand(
                        User.GetId(),
                        model.OldPassword,
                        model.NewPassword)));

    [AllowAnonymous]
    [HttpGet(nameof(ConfirmEmail))]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var result = await _mediator.Send(new ConfirmEmailCommand(userId, token));

        return Redirect(result.IsSuccess
            ? "http://localhost:5173/?emailConfirmed=true"
            : "http://localhost:5173/?emailConfirmed=false");
    }

    [HttpPost(nameof(RequestEmailChange))]
    public async Task<IActionResult> RequestEmailChange(EmailChangeRequestModel model)
    {
        var result = await _profileService.SendEmailChangeAsync(
            model.NewEmail,
            User.GetId().ToString());

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(ChangeEmail))]
    public async Task<IActionResult> ChangeEmail(string userId, string token, string newEmail)
    {
        var command = new ChangeEmailCommand(userId, token, newEmail);

        var result = await _mediator.Send(command);

        return Redirect(result.IsSuccess
            ? "http://localhost:5173/?emailChanged=true"
            : "http://localhost:5173/?emailChanged=false");
    }

    [AllowAnonymous]
    [HttpPost(nameof(ForgotPassword))]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequestModel model)
    {
        var result = await _profileService.SendForgotPasswordEmailAsync(model.Email);

        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpPost(nameof(ResetPassword))]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequestModel model)
    {
        var result = await _mediator.Send(new ResetPasswordCommand(
            model.Email,
            model.Token,
            model.Password));

        return this.OkOrProblemDetails(result);
    }

    [PageValidationFilter]
    [HttpGet(nameof(GetFollowing))]
    public async Task<IActionResult> GetFollowing(int page)
    {
        var query = new GetFollowedUsersQuery(User.GetId(), page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(ChangeBio))]
    public async Task<IActionResult> ChangeBio(ChangeBioRequestDto model)
    {
        var command = new ChangeBioCommand(User.GetId(), model.Bio);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetBio))]
    public async Task<IActionResult> GetBio()
    {
        var query = new GetBioQuery(User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
