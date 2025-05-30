﻿using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;

using Explorify.Infrastructure.Settings;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Explorify.Infrastructure.Services;

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
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = signingCredentials,
            EncryptingCredentials = encryptingCredentials,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience
        };

        string accessToken = new JsonWebTokenHandler().CreateToken(tokenDescriptor);

        return accessToken;
    }

    public string GenerateRefreshToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
}
