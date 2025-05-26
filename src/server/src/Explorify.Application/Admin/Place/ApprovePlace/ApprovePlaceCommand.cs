using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Place.ApprovePlace;

public record ApprovePlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId) : ICommand;
