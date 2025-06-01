using System.Diagnostics;

namespace Explorify.Api;

public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    public RequestTimingMiddleware(
        RequestDelegate next,
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        var elapsedMs = stopwatch.ElapsedMilliseconds;
        var method = context.Request.Method;
        var path = context.Request.Path;
        var statusCode = context.Response.StatusCode;

        _logger.LogInformation("Request {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds}ms",
            method,
            path,
            statusCode,
            elapsedMs);
    }
}
