using Explorify.Api.Extensions;
using Explorify.Application.Countries;

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

        if (result.IsSuccess)
        {
            return Ok(result.Data);
        }

        return result.ToProblemDetails();
    }
}
