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
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetCategoriesQuery()));

    [AllowAnonymous]
    [HttpGet(nameof(GetSubcategories))]
    public async Task<IActionResult> GetSubcategories(int categoryId)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetSubcategoriesQuery(categoryId)));

    [AllowAnonymous]
    [HttpGet(nameof(GetSubcategoriesBySlugName))]
    public async Task<IActionResult> GetSubcategoriesBySlugName(string categoryName)
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetSubcategoriesBySlugNameQuery(categoryName)));

    [AllowAnonymous]
    [HttpGet(nameof(GetCategoryOptions))]
    public async Task<IActionResult> GetCategoryOptions()
        => this.OkOrProblemDetails(
                await _mediator.Send(
                    new GetCategoryOptionsQuery()));
}
