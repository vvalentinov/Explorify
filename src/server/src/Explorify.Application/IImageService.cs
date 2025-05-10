using Explorify.Application.Abstractions.Models;

namespace Explorify.Application;

public interface IImageService
{
    Task<IEnumerable<UploadFile>> ProcessPlaceImagesAsync(IEnumerable<UploadFile> file);

    Task<UploadFile> ProcessProfileImageAsync(UploadFile file);
}
