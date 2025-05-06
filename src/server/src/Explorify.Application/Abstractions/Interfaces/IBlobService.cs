namespace Explorify.Application.Abstractions.Interfaces;

public interface IBlobService
{
    Task<string> UploadBlobAsync(
            Stream fileStream,
            string fileName,
            string? pathPrefix = null,
            bool shouldGenerateUniqueName = true);
}
