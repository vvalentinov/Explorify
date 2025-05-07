using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.Upload;

public record UploadReviewCommand(UploadReviewRequestModel Model)
    : ICommand;
