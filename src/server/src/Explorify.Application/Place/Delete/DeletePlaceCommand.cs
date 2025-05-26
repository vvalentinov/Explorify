using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Delete;

public record DeletePlaceCommand(
    DeletePlaceDto Model,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
