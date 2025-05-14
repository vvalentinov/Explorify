using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IImageService
{
    Task<IEnumerable<UploadFile>> ProcessPlaceImagesAsync(IEnumerable<UploadFile> file);

    Task<UploadFile> ProcessProfileImageAsync(UploadFile file);
}
