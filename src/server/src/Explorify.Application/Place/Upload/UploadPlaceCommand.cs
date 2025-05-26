using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Upload;

public record UploadPlaceCommand(UploadPlaceRequestModel Model)
    : ICommand;
