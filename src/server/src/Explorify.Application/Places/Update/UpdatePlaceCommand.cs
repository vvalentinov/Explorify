using Explorify.Application.Places.Upload;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.Update;

public record UpdatePlaceCommand(UploadPlaceRequestModel Model)
    : ICommand;

