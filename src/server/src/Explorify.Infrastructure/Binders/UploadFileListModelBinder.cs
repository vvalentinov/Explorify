using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Explorify.Infrastructure.Binders;

public class UploadFileListModelBinder : IModelBinder
{
    public async Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var files = bindingContext.HttpContext.Request.Form.Files;

        var result = new List<UploadFile>();

        foreach (var file in files)
        {
            var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            ms.Position = 0;

            result.Add(new UploadFile
            {
                Content = ms,
                FileName = file.FileName,
                ContentType = file.ContentType,
            });
        }

        bindingContext.Result = ModelBindingResult.Success(result);
    }
}
