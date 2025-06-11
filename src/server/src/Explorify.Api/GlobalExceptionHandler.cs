using FluentValidation;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Explorify.Api;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        IActionResult result;

        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .Select(e => e.ErrorMessage)
                .Distinct();

            var problemDetails = ApiProblemFactory.Create(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Validation Failed",
                type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                errors: errors
            );

            result = ApiProblemFactory.Wrap(problemDetails);
        }
        else
        {
            var problemDetails = ApiProblemFactory.Create(
                statusCode: StatusCodes.Status500InternalServerError,
                title: "Server Error",
                type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
                errors: ["An unexpected error occurred!"]
            );

            result = ApiProblemFactory.Wrap(problemDetails);
        }

        var actionContext = new ActionContext(
            httpContext,
            httpContext.GetRouteData(),
            new ActionDescriptor(),
            new ModelStateDictionary()
        );

        await result.ExecuteResultAsync(actionContext);

        return true;
    }
}
