namespace Explorify.Application.User.GetProfileInfo;

public class GetProfileInfoResponseModel
{
    public string? ProfileImageUrl { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public int Points { get; set; }

    public int UploadedPlacesCount { get; set; }

    public int UploadedReviewsCount { get; set; }
}
