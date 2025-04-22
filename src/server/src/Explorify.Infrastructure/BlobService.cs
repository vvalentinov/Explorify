using Explorify.Application;

using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace Explorify.Infrastructure;

public class BlobService : IBlobService
{
    private readonly AzureStorageSettings _azureStorageSettings;

    public BlobService(IOptions<AzureStorageSettings> options)
    {
        _azureStorageSettings = options.Value;
    }

    public async Task<string> UploadBlobAsync(
        Stream fileStream,
        string fileName,
        string? pathPrefix = null)
    {
        var blobServiceClient = new BlobServiceClient(_azureStorageSettings.ConnectionString);

        var containerName = _azureStorageSettings.ContainerName;
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.UploadAsync(fileStream, true);

        return Uri.UnescapeDataString(blobClient.Uri.AbsoluteUri);
    }
}
