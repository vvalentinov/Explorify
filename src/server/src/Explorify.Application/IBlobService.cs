namespace Explorify.Application;

public interface IBlobService
{
    Task<string> UploadBlobAsync(
            Stream fileStream,
            string fileName,
            string? pathPrefix = null);
}
