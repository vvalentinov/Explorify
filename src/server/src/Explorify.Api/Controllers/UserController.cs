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

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Explorify.Infrastructure;
using Azure.Core;
using System.Web;

namespace Explorify.Api.Controllers;

public class UserController : BaseController
{
    private readonly IMediator _mediator;

    private readonly IProfileService _profileService;

    public UserController(
        IMediator mediator,
        IProfileService profileService)
    {
        _mediator = mediator;

        _profileService = profileService;
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

    [AllowAnonymous]
    [HttpPost(nameof(Refresh))]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        return Ok();
    }

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
}
