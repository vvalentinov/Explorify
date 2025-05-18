using System.Security.Claims;

using Explorify.Application.Places;
using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Explorify.Infrastructure.Binders;

public class EditPlaceRequestModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var form = bindingContext.HttpContext.Request.Form;

        var model = new EditPlaceRequestModel
        {
            NewImages = new List<UploadFile>(),
            ToBeRemovedImagesIds = new List<int>(),
            Name = form["Name"].FirstOrDefault() ?? string.Empty,
            Address = form["Address"].FirstOrDefault() ?? string.Empty,
            Description = form["Description"].FirstOrDefault() ?? string.Empty,
            ReviewContent = form["ReviewContent"].FirstOrDefault() ?? string.Empty,
            CountryId = int.TryParse(form["CountryId"], out int countryId) ? countryId : 0,
            CategoryId = int.TryParse(form["CategoryId"], out int categoryId) ? categoryId : 0,
            SubcategoryId = int.TryParse(form["SubcategoryId"], out int subcategoryId) ? subcategoryId : 0,
            ReviewRating = int.TryParse(form["ReviewRating"], out int reviewRating) ? reviewRating : 0,
            UserId = Guid.Parse(bindingContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty),
        };

        foreach (var imageId in form["ToBeRemovedImagesIds"])
        {
            bool isValidInt = int.TryParse(imageId, out int tagId);

            if (isValidInt)
            {
                model.ToBeRemovedImagesIds.Add(tagId);
            }
        }

        foreach (var file in form.Files)
        {
            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            model.NewImages.Add(new UploadFile
            {
                Content = memoryStream,
                FileName = file.FileName,
                ContentType = file.ContentType,
            });
        }

        bindingContext.Result = ModelBindingResult.Success(model);
    }
}
