using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class UserController : BaseController
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpPost(nameof(Login))]
    public async Task<IActionResult> Login(LoginRequestModel model)
    {
        var request = new LoginRequest(model);

        var loginResult = await _mediator.Send(request);

        //Response.AppendRefreshTokenCookie(loginResult.Item2);

        return Ok(loginResult.Item1);
    }

    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public async Task<IActionResult> Register(RegisterRequestModel model)
    {
        var request = new RegisterRequest(model);

        var registerResult = await _mediator.Send(request);

        //Response.AppendRefreshTokenCookie(registerResult.Item2);

        return Ok(registerResult.Item1);
    }

    //[AllowAnonymous]
    //[HttpPost(nameof(Refresh))]
    //public async Task<IActionResult> Refresh()
    //{
    //    var refreshToken = Request.Cookies["refreshToken"];

    //    if (string.IsNullOrEmpty(refreshToken))
    //    {
    //        return Unauthorized("Refresh token missing!");
    //    }

    //    var refreshTokenRecord = await _dbContext.RefreshTokens
    //        .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

    //    if (refreshTokenRecord == null || refreshTokenRecord.ExpiresOn < DateTime.UtcNow)
    //    {
    //        return Unauthorized("Invalid or expired refresh token");
    //    }

    //    var user = await _userManager
    //        .FindByIdAsync(refreshTokenRecord.UserId.ToString());

    //    if (user == null)
    //    {
    //        return Unauthorized("User not found");
    //    }

    //    var claims = new List<Claim>
    //    {
    //        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
    //        new(ClaimTypes.Name, user.UserName ?? string.Empty),
    //    };

    //    var roles = await _userManager.GetRolesAsync(user);

    //    foreach (var role in roles)
    //    {
    //        claims.Add(new Claim(ClaimTypes.Role, role));
    //    }

    //    var newAccessToken = _tokenService.GenerateAccessToken(claims);

    //    bool isAdmin = await _userManager.IsInRoleAsync(user, "Administrator");

    //    var result = new IdentityResponseModel
    //    {
    //        AccessToken = newAccessToken,
    //        IsAdmin = isAdmin,
    //        UserId = user.Id.ToString(),
    //        UserName = user.UserName ?? string.Empty,
    //    };

    //    return Ok(result);
    //}
}
