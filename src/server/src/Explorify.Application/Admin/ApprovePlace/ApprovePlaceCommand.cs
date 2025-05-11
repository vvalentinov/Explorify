using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.ApprovePlace;

public record ApprovePlaceCommand(Guid PlaceId)
    : ICommand;
