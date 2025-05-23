using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Reviews;

public class ReviewResponseModel
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public int Likes { get; set; }

    public string PlaceName { get; set; } = string.Empty;

    public UserReviewDto User { get; set; } = new();

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
