using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Edit;

public record EditPlaceCommand(EditPlaceRequestModel Model)
    : ICommand;

