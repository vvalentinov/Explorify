namespace Explorify.Application.Abstractions.Models;

public class UploadFile
{
    public Stream Content { get; set; } = default!;

    public string FileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;
}
