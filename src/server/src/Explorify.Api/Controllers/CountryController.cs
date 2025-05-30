﻿using Explorify.Api.Extensions;
using Explorify.Application.Country;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class CountryController : BaseController
{
    private readonly IMediator _mediator;

    public CountryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetCountries))]
    public async Task<IActionResult> GetCountries(string nameFilter)
    {
        var query = new GetCountriesQuery(nameFilter);
        var result = await _mediator.Send(query);
        return ControllerBaseExtensions.OkOrProblemDetails(this, result);
    }
}
