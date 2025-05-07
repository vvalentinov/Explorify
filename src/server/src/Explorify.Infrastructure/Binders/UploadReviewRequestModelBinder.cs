using System.Security.Claims;

using Explorify.Application.Reviews.Upload;
using Explorify.Application.Abstractions.Models;

using FluentValidation;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;

using static System.Security.Claims.ClaimTypes;

namespace Explorify.Infrastructure.Binders;

public class UploadReviewRequestModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var form = bindingContext.HttpContext.Request.Form;

        var model = new UploadReviewRequestModel
        {
            Content = form["Content"]!,
            PlaceId = Guid.TryParse(form["PlaceId"], out Guid placeId) ? placeId : Guid.Empty,
            Rating = int.TryParse(form["Rating"], out int reviewRating) ? reviewRating : 0,
            UserId = Guid.Parse(bindingContext.HttpContext.User.FindFirstValue(NameIdentifier) ?? string.Empty),
        };

        foreach (var file in form.Files)
        {
            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            model.Files.Add(new UploadFile
            {
                Content = memoryStream,
                FileName = file.FileName,
                ContentType = file.ContentType,
            });
        }

        var validator = bindingContext
            .HttpContext
            .RequestServices
            .GetService<IValidator<UploadReviewRequestModel>>();

        if (validator is not null)
        {
            var validationResult = await validator.ValidateAsync(model);

            if (validationResult.IsValid == false)
            {
                foreach (var error in validationResult.Errors)
                {
                    bindingContext
                        .ModelState
                        .AddModelError(
                            error.PropertyName,
                            error.ErrorMessage);
                }
            }
        }

        bindingContext.Result = ModelBindingResult.Success(model);
    }
}
