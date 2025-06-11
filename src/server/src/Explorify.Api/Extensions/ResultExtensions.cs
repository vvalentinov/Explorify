using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToProblemDetails(this Result result)
    {
        if (result.IsSuccess)
        {
            throw new InvalidOperationException("Cannot convert success result to problem!");
        }

        return ApiProblemFactory.Wrap(result.Error);
    }
}
