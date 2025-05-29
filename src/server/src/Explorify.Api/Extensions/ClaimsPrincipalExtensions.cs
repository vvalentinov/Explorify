using System.Security.Claims;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using static System.Security.Claims.ClaimTypes;

namespace Explorify.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetId(this ClaimsPrincipal user)
    {
        string userId = user.FindFirstValue(NameIdentifier) ?? string.Empty;
        return userId == string.Empty ? Guid.Empty : Guid.Parse(userId);
    }

    public static string GetUserName(this ClaimsPrincipal user)
        => user.FindFirstValue(Name) ?? string.Empty;

    public static bool IsAdmin(this ClaimsPrincipal user)
        => user.Identity?.IsAuthenticated == true &&
           user.IsInRole(AdminRoleName);

    public static bool IsAuthenticated(this ClaimsPrincipal user)
        => user.Identity?.IsAuthenticated == true;
}
