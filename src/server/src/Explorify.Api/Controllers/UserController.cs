using Explorify.Api.Extensions;

using Explorify.Infrastructure;
using Explorify.Infrastructure.Attributes;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.UserFollow.GetFollowedUsers;
using Explorify.Application.User.GetProfileInfo;
using Explorify.Application.User.Account.GetBio;
using Explorify.Application.User.Account.ChangeBio;
using Explorify.Application.User.Account.ChangeEmail;
using Explorify.Application.User.Account.ConfirmEmail;
using Explorify.Application.User.Account.ResetPassword;
using Explorify.Application.User.Account.ChangeUserName;
using Explorify.Application.User.Account.ChangePassword;
using Explorify.Application.User.Account.ForgotPassword;
using Explorify.Application.User.Account.ChangeProfileImage;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class UserController : BaseController
{
    private readonly IMediator _mediator;

    private readonly IProfileService _profileService;
    private readonly IConfiguration _configuration;

    public UserController(
        IMediator mediator,
        IProfileService profileService,
        IConfiguration configuration)
    {
        _mediator = mediator;

        _profileService = profileService;
        _configuration = configuration;
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

    [HttpPost(nameof(ChangeUsername))]
    public async Task<IActionResult> ChangeUsername(ChangeUserNameRequestModel model)
    {
        var command = new ChangeUserNameCommand(User.GetId(), model.UserName);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpPost(nameof(ChangePassword))]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequestModel model)
    {
        var command = new ChangePasswordCommand(User.GetId(), model.OldPassword, model.NewPassword);
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(ConfirmEmail))]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var result = await _mediator.Send(new ConfirmEmailCommand(userId, token));

        var frontEndUrl = _configuration["FrontEnd:Url"];

        var redirectUrl = $"{frontEndUrl}/?emailConfirmed={(result.IsSuccess ? "true" : "false")}";

        return Redirect(redirectUrl);
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
    public async Task<IActionResult> ChangeEmail(
        string userId,
        string token,
        string newEmail)
    {
        var command = new ChangeEmailCommand(userId, token, newEmail);

        var result = await _mediator.Send(command);

        var frontEndUrl = _configuration["FrontEnd:Url"];

        var redirectUrl = $"{frontEndUrl}/?emailConfirmed={(result.IsSuccess ? "true" : "false")}";

        return Redirect(redirectUrl);
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
    public async Task<IActionResult> GetFollowing(
        int page = 1,
        string sortDirection = "asc")
    {
        var query = new GetFollowedUsersQuery(User.GetId(), page, sortDirection);
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
