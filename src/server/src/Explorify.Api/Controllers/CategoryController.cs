using Explorify.Api.Extensions;
using Explorify.Application.Categories.GetCategories;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

public class CategoryController : BaseController
{
    private readonly IMediator _mediator;

    public CategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetCategories))]
    public async Task<IActionResult> GetCategories()
    {
        var query = new GetCategoriesQuery();

        var result = await _mediator.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Data);
        }

        return result.ToProblemDetails();
    }
}
