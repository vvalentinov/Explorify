using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.Update;

public record UpdatePlaceCommand(EditPlaceRequestModel Model)
    : ICommand;

