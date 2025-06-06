namespace Explorify.Infrastructure.Settings;

public class SendGridSettings
{
    public string ApiKey { get; set; } = string.Empty;

    public string ConfirmEmailTemplateId { get; set; } = string.Empty;
}
