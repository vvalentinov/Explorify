namespace Explorify.Application.Abstractions.Email;

public class EmailAttachment
{
    public byte[] Content { get; set; } = [];

    public string FileName { get; set; } = string.Empty;

    public string MimeType { get; set; } = string.Empty;
}
