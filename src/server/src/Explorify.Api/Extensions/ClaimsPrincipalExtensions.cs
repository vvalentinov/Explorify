using System.Security.Claims;

using static System.Security.Claims.ClaimTypes;

namespace Explorify.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetId(this ClaimsPrincipal user)
    {
        //string userId = user.FindFirstValue(NameIdentifier) ??
        //    throw new InvalidOperationException("User ID was not found!");

        string userId = user.FindFirstValue(NameIdentifier) ?? string.Empty;

        return userId == string.Empty ? Guid.Empty : Guid.Parse(userId);
    }

    public static string GetUserName(this ClaimsPrincipal user)
        => user.FindFirstValue(Name) ??
            throw new InvalidOperationException("UserName was not found!");
}
