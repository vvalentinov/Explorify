using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Reviews.Edit;

public class EditReviewRequestModel
{
    public Guid Id { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    public List<UploadFile> NewImages { get; set; } = new();

    public List<int> ToBeRemovedImagesIds { get; set; } = new();
}
