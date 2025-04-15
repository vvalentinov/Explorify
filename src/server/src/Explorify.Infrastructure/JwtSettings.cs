namespace Explorify.Infrastructure;

public class JwtSettings
{
    public string SignKey { get; set; } = string.Empty;

    public string EncryptKey { get; set; } = string.Empty;
}
