using Explorify.Api.Extensions;
using Explorify.Application.Categories.GetCategories;
using Explorify.Application.Categories.GetSubcategories;
using Explorify.Application.Categories.GetCategoryOptions;
using Explorify.Application.Categories.GetSubcategoriesByName;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Explorify.Api.Controllers;

[AllowAnonymous]
public class CategoryController : BaseController
{
    private readonly IMediator _mediator;

    public CategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet(nameof(GetCategories))]
    public async Task<IActionResult> GetCategories()
    {
        var query = new GetCategoriesQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetSubcategories))]
    public async Task<IActionResult> GetSubcategories(int categoryId)
    {
        var query = new GetSubcategoriesQuery(categoryId);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetSubcategoriesBySlugName))]
    public async Task<IActionResult> GetSubcategoriesBySlugName(string categoryName)
    {
        var query = new GetSubcategoriesBySlugNameQuery(categoryName);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetCategoryOptions))]
    public async Task<IActionResult> GetCategoryOptions()
    {
        var query = new GetCategoryOptionsQuery();
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }
}
