using Explorify.Infrastructure.Binders;
using Explorify.Application.Reviews.Upload;
using Explorify.Application.Abstractions.Models;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.DTOs;

public class UploadReviewRequestDto
{
    public Guid PlaceId { get; set; }

    public int Rating { get; set; }

    public string Content { get; set; } = string.Empty;

    [ModelBinder(BinderType = typeof(UploadFileListModelBinder))]
    public List<UploadFile> Files { get; set; } = [];

    public UploadReviewRequestModel ToApplicationModel(Guid userId) => new UploadReviewRequestModel
    {
        Content = Content,
        Files = Files,
        UserId = userId,
        PlaceId = PlaceId,
        Rating = Rating,
    };
}
