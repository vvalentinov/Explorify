using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Places.RevertPlace;

public record RevertPlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId,
    bool IsCurrUserAdmin) : ICommand;
