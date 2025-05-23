using Explorify.Application.Places.GetEditData;

namespace Explorify.Application.Reviews.GetEditInfo;

public class GetReviewEditInfoResponseModel
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<ImageResponseModel> Images { get; set; } = new();
}
