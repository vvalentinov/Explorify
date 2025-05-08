using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Reviews;

public class ReviewResponseModel
{
    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public UserReviewDto User { get; set; } = default!;

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
