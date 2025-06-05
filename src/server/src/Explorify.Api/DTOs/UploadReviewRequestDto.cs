namespace Explorify.Api.DTOs;

public class UploadReviewRequestDto
{
    public Guid PlaceId { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<IFormFile> Files { get; set; } = [];
}
