using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Extensions;

public static class ControllerBaseExtensions
{
    public static IActionResult OkOrProblemDetails<T>(
        this ControllerBase controller,
        Result<T> result)
            => result.IsSuccess
                ? controller.Ok(result.Data)
                : result.ToProblemDetails();

    public static IActionResult OkOrProblemDetails(
        this ControllerBase controller,
        Result result)
            => result.IsSuccess
                ? controller.Ok(result)
                : result.ToProblemDetails();

    public static IActionResult CreatedAtActionOrProblemDetails(
       this ControllerBase controller,
       Result result,
       string actionName)
            => result.IsSuccess ?
                controller.CreatedAtAction(actionName, result) :
                result.ToProblemDetails();

    public static IActionResult CreatedAtActionOrProblemDetails<T>(
       this ControllerBase controller,
       Result<T> result,
       string actionName)
            => result.IsSuccess ?
                controller.CreatedAtAction(actionName, result.Data) :
                result.ToProblemDetails();
}
