using Explorify.Application.Abstractions.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api;

public static class ApiProblemFactory
{
    public static ProblemDetails Create(
        int statusCode,
        string title,
        string type,
        string? detail = null,
        IEnumerable<string>? errors = null)
    {
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Type = type,
            Detail = detail
        };

        if (errors != null)
        {
            problemDetails.Extensions["errors"] = errors.ToArray();
        }

        return problemDetails;
    }

    public static ProblemDetails Create(Error error)
    {
        return Create(
            statusCode: GetStatusCode(error.Type),
            title: GetTitle(error.Type),
            type: GetType(error.Type),
            errors: [error.Description]
        );
    }

    public static IActionResult Wrap(ProblemDetails problemDetails)
    {
        var wrapped = new { problemDetails };

        return new ObjectResult(wrapped)
        {
            StatusCode = problemDetails.Status
        };
    }

    public static IActionResult Wrap(Error error)
    {
        var problemDetails = Create(error);
        return Wrap(problemDetails);
    }

    private static int GetStatusCode(ErrorType type) =>
        type switch
        {
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };

    private static string GetTitle(ErrorType type) =>
        type switch
        {
            ErrorType.NotFound => "Not Found",
            ErrorType.Validation => "Bad Request",
            ErrorType.Conflict => "Conflict",
            _ => "Server Failure"
        };

    private static string GetType(ErrorType type) =>
        type switch
        {
            ErrorType.NotFound => "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
            ErrorType.Validation => "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",
            ErrorType.Conflict => "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.8",
            _ => "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1"
        };
}
