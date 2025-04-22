namespace Explorify.Infrastructure;

public class AzureStorageSettings
{
    public string StorageAccountName { get; set; } = string.Empty;

    public string ConnectionString { get; set; } = string.Empty;

    public string ContainerName { get; set; } = string.Empty;
}
