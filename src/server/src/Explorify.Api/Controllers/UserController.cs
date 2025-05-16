using Explorify.Api.Extensions;
using Explorify.Application.User;
using Explorify.Infrastructure.Attributes;
using Explorify.Application.Identity.Login;
using Explorify.Application.User.ChangeEmail;
using Explorify.Application.Identity.Register;
using Explorify.Application.User.ConfirmEmail;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.User.ChangeUserName;
using Explorify.Application.User.ChangePassword;
using Explorify.Application.User.GetProfileInfo;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.User.ChangeProfileImage;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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

    [HttpGet(nameof(GetProfileInfo))]
    public async Task<IActionResult> GetProfileInfo()
    {
        var query = new GetProfileInfoQuery(User.GetId().ToString());
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
        var result = await _mediator.Send(new ChangeEmailCommand(userId, token, newEmail));

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
}
