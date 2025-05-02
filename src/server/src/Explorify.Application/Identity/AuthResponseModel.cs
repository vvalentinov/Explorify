namespace Explorify.Application.Identity;

public class AuthResponseModel
{
    public IdentityResponseModel IdentityModel { get; set; } = default!;

    public string RefreshToken { get; set; } = string.Empty;
}
