using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

using SharpGrip.FluentValidation.AutoValidation.Mvc.Results;

namespace Explorify.Api;

public class CustomResultFactory
    : IFluentValidationAutoValidationResultFactory
{
    public IActionResult CreateActionResult(
        ActionExecutingContext context,
        ValidationProblemDetails? validationProblemDetails)
    {
        var errors = validationProblemDetails?.Errors.SelectMany(e => e.Value);

        var problemDetails = ApiProblemFactory.Create(
           statusCode: StatusCodes.Status400BadRequest,
           title: "Bad Request",
           type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",
           errors: errors
       );

        return ApiProblemFactory.Wrap(problemDetails);
    }
}
