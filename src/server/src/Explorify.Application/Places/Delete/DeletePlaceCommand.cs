using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.Delete;

public record DeletePlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
