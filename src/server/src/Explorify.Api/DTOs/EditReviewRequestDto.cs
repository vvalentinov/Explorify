namespace Explorify.Api.DTOs;

public class EditReviewRequestDto
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<IFormFile> NewImages { get; set; } = new();

    public List<int> ToBeRemovedImagesIds { get; set; } = new();
}
