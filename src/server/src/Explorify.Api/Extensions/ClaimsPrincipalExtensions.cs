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
        => user.FindFirstValue(Name) ??
            throw new InvalidOperationException("UserName was not found!");

    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        //var roleClaim = user.Claims.FirstOrDefault(x => x.ValueType == Role);

        //if (roleClaim != null)
        //{
        //    if (roleClaim.Value == AdminRoleName)
        //    {
        //        return true;
        //    }

        //    return false;
        //}

        //return false;

        return user.IsInRole(AdminRoleName);
    }
}
