using System.Security.Claims;

namespace Explorify.Application.Abstractions.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);

    string GenerateRefreshToken();
}
