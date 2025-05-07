using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Reviews.Upload;

public class UploadReviewRequestModel
{
    public Guid UserId { get; set; }

    public Guid PlaceId { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<UploadFile> Files { get; set; } = [];
}
