using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Explorify.Infrastructure.Binders;

public class UploadFileModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var form = bindingContext.HttpContext.Request.Form;

        if (form.Files.Count == 1)
        {
            var model = new UploadFile();

            var file = form.Files[0];

            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            model.Content = memoryStream;
            model.FileName = file.FileName;
            model.ContentType = file.ContentType;

            bindingContext.Result = ModelBindingResult.Success(model);
        }
    }
}
