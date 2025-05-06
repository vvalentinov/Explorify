using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace Explorify.Infrastructure.Services;

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
        string? pathPrefix = null,
        bool shouldGenerateUniqueName = true)
    {
        var blobServiceClient = new BlobServiceClient(_azureStorageSettings.ConnectionString);

        var containerName = _azureStorageSettings.ContainerName;
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        string name = shouldGenerateUniqueName ?
            GenerateUniqueName(fileName, pathPrefix ?? string.Empty) :
            $"{pathPrefix}{fileName}";

        var blobClient = containerClient.GetBlobClient(name);

        await blobClient.UploadAsync(fileStream, overwrite: true);

        return Uri.UnescapeDataString(blobClient.Uri.AbsoluteUri);
    }

    private static string GenerateUniqueName(string fileName, string path)
            => $"{path}" +
        $"{Path.GetFileNameWithoutExtension(fileName)}" +
        $"{Guid.NewGuid()}" +
        $"{Path.GetExtension(fileName)}";
}
