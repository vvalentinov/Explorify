﻿using Explorify.Api.Extensions;
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
        var loginRequestQuery = new LoginQuery(model);

        var loginResult = await _mediator.Send(loginRequestQuery);

        Response.AppendRefreshTokenCookie(loginResult.Data.RefreshToken);

        return Ok(loginResult.Data.IdentityModel);
    }

    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public async Task<IActionResult> Register(RegisterRequestModel model)
    {
        var registerCommand = new RegisterCommand(model);

        var registerResult = await _mediator.Send(registerCommand);

        Response.AppendRefreshTokenCookie(registerResult.Data.RefreshToken);

        return Ok(registerResult.Data.IdentityModel);
    }
}
