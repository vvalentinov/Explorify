using Explorify.Api.Extensions;
using Explorify.Application.Categories.GetCategories;
using Explorify.Application.Categories.GetSubcategories;
using Explorify.Application.Categories.GetCategoryOptions;
using Explorify.Application.Categories.GetSubcategoriesByName;

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
        return ControllerBaseExtensions.OkOrProblemDetails(this, result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetSubcategories))]
    public async Task<IActionResult> GetSubcategories(int categoryId)
    {
        var query = new GetSubcategoriesQuery(categoryId);
        var result = await _mediator.Send(query);
        return ControllerBaseExtensions.OkOrProblemDetails(this, result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetSubcategoriesByName))]
    public async Task<IActionResult> GetSubcategoriesByName(string categoryName)
    {
        var query = new GetSubcategoriesByNameQuery(categoryName);
        var result = await _mediator.Send(query);
        return ControllerBaseExtensions.OkOrProblemDetails(this, result);
    }

    [AllowAnonymous]
    [HttpGet(nameof(GetCategoryOptions))]
    public async Task<IActionResult> GetCategoryOptions()
    {
        var query = new GetCategoryOptionsQuery();
        var result = await _mediator.Send(query);
        return ControllerBaseExtensions.OkOrProblemDetails(this, result);
    }
}
