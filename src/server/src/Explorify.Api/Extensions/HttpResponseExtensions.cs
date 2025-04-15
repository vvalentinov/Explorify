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
               Secure = true,
               HttpOnly = true,
               SameSite = SameSiteMode.Strict,
               Expires = DateTime.UtcNow.AddDays(7)
           });

        return httpResponse;
    } 
}
