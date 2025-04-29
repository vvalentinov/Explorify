using System.Security.Claims;
using Explorify.Application.Places.Upload;
using Explorify.Application.Abstractions.Models;

using static System.Security.Claims.ClaimTypes;

using FluentValidation;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Infrastructure.Binders;

public class UploadPlaceRequestModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var form = bindingContext.HttpContext.Request.Form;

        var model = new UploadPlaceRequestModel
        {
            Name = form["Name"]!,
            Files = new List<UploadFile>(),
            Description = form["Description"]!,
            ReviewContent = form["ReviewContent"]!,
            CountryId = int.TryParse(form["CountryId"], out int countryId) ? countryId : 0,
            CategoryId = int.TryParse(form["CategoryId"], out int categoryId) ? categoryId : 0,
            SubcategoryId = int.TryParse(form["SubcategoryId"], out int subcategoryId) ? subcategoryId : 0,
            ReviewRating = int.TryParse(form["ReviewRating"], out int reviewRating) ? reviewRating : 0,
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
            .GetService<IValidator<UploadPlaceRequestModel>>();

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
