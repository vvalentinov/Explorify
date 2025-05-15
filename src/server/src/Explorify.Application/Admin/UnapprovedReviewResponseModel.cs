namespace Explorify.Application.Admin;

public class UnapprovedReviewResponseModel
{
    public Guid Id { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string UserId { get; set; }

    public string UserProfilePicUrl { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public int Rating { get; set; }

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
