using System.Text;
using Explorify.Application;
using System.Security.Claims;
using System.Security.Cryptography;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Explorify.Infrastructure;

public class TokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IOptions<JwtSettings> jwtSettingsOptions)
    {
        _jwtSettings = jwtSettingsOptions.Value;
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var signKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SignKey));
        var encryptKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.EncryptKey));

        var signingCredentials = new SigningCredentials(
            signKey,
            SecurityAlgorithms.HmacSha256Signature
        );

        var encryptingCredentials = new EncryptingCredentials(
            encryptKey,
            SecurityAlgorithms.Aes256KW,
            SecurityAlgorithms.Aes256CbcHmacSha512
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(50),
            SigningCredentials = signingCredentials,
            EncryptingCredentials = encryptingCredentials,
        };

        string accessToken = new JsonWebTokenHandler().CreateToken(tokenDescriptor);

        return accessToken;
    }

    public string GenerateRefreshToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
}
