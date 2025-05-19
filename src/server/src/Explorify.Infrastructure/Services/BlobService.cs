using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

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

    public async Task DeleteBlobAsync(string blobUrl)
    {
        var blobServiceClient = new BlobServiceClient(_azureStorageSettings.ConnectionString);

        var containerName = _azureStorageSettings.ContainerName;
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        string blobName = GetBlobNameFromUrl(blobUrl, containerName);

        var blobClient = containerClient.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
    }

    private static string GetBlobNameFromUrl(string fileUrl, string containerName)
    {
        var uri = new Uri(fileUrl);
        var absolutePath = uri.AbsolutePath;

        var prefix = $"/{containerName}/";

        if (!absolutePath.StartsWith(prefix))
        {
            throw new InvalidOperationException("Blob URL does not match expected container.");
        }

        // Strip the container path
        var encodedBlobName = absolutePath[prefix.Length..];

        // Decode special characters like %20, %C6%A1, etc.
        var decodedBlobName = Uri.UnescapeDataString(encodedBlobName);

        return decodedBlobName;
    }

    private static string GenerateUniqueName(string fileName, string path)
            => $"{path}" +
                    $"{Path.GetFileNameWithoutExtension(fileName)}" +
                    $"{Guid.NewGuid()}" +
                    $"{Path.GetExtension(fileName)}";
}
