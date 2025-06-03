namespace Explorify.Api.Extensions;

public static class HttpResponseExtensions
{
    public static HttpResponse AppendRefreshTokenCookie(
        this HttpResponse httpResponse,
        string refreshToken)
    {
        //httpResponse.Cookies.Append(
        //   "refreshToken",
        //   refreshToken,
        //   new CookieOptions
        //   {
        //       Secure = true,
        //       HttpOnly = true,
        //       SameSite = SameSiteMode.Strict,
        //       Expires = DateTime.UtcNow.AddDays(7)
        //   });

        //return httpResponse;

        httpResponse.Cookies.Append(
            "refreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // ❗required when SameSite=None
                SameSite = SameSiteMode.None, // ✅ allows cross-site cookie sending
                Expires = DateTime.UtcNow.AddDays(7)
            });

        return httpResponse;
    } 
}
