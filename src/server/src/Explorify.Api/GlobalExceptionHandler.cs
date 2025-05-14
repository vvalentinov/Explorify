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

        var problemDetails = Results.Problem(
            statusCode: StatusCodes.Status500InternalServerError,
            title: "Server Error",
            type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            extensions: new Dictionary<string, object?>
            {
                {"errors", Array.Empty<object>() }
            }
        );

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(new ObjectResult(problemDetails).Value, cancellationToken);

        return true;
    }
}
