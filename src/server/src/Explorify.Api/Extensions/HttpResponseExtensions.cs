namespace Explorify.Api.Extensions;

public static class HttpResponseExtensions
{
    public static HttpResponse AppendRefreshTokenCookie(
        this HttpResponse httpResponse,
        string refreshToken)
    {
        httpResponse.Cookies.Append(
            "refreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

        return httpResponse;
    }
}
