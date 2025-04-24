using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.Upload;

public record UploadPlaceCommand(UploadPlaceRequestModel Model)
    : ICommand;
