using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Place.UnapprovePlace;

public record UnapprovePlaceCommand(
    UnapprovePlaceCommandDto Model,
    Guid CurrentUserId) : ICommand;
