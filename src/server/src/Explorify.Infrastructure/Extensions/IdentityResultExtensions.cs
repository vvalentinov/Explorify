using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Extensions;

public static class IdentityResultExtensions
{
    public static string GetFirstError(this IdentityResult result)
    {
        if (result.Succeeded == false)
        {
            return result.Errors.Select(e => e.Description).First();
        }

        return string.Empty;
    }

    public static bool HasDuplicateUserNameOrEmailErrors(this IdentityResult result)
        => result.Errors.Any(e => e.Code == "DuplicateUserName" || e.Code == "DuplicateEmail");
}
