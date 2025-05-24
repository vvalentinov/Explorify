using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Place.RevertPlace;

public record AdminRevertPlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId) : ICommand;
