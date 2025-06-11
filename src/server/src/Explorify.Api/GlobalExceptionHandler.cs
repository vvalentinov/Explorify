using FluentValidation;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;

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
        _logger.LogError(exception, $"Exception occured: {exception.Message}");

        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .Select(e => e.ErrorMessage)
                .Distinct()
                .ToList();

            var validationProblemDetails = Results.Problem(
               statusCode: StatusCodes.Status400BadRequest,
               title: "Validation Failed",
               type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
               extensions: new Dictionary<string, object?>
               {
                    {"errors", errors }
               }
           );

            httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

            await httpContext.Response.WriteAsJsonAsync(
                new ObjectResult(validationProblemDetails).Value,
                cancellationToken);

            return true;
        }

        var problemDetails = Results.Problem(
            statusCode: StatusCodes.Status500InternalServerError,
            title: "Server Error",
            type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            extensions: new Dictionary<string, object?>
            {
                {"errors", new List<string>() { "An unexpected error ocurred!" } }
            }
        );

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(
            new ObjectResult(problemDetails).Value,
            cancellationToken);

        return true;
    }
}
