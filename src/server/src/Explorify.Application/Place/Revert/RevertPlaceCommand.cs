using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Place.Revert;

public record RevertPlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
