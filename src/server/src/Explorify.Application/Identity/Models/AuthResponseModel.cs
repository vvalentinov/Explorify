namespace Explorify.Application.Identity.Models;

public class AuthResponseModel
{
    public IdentityResponseModel IdentityModel { get; set; } = default!;

    public string RefreshToken { get; set; } = string.Empty;
}
