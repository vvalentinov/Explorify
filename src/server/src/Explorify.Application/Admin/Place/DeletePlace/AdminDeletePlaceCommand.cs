using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.Place.DeletePlace;

public record AdminDeletePlaceCommand(
    Guid CurrentUserId,
    AdminDeletePlaceDto Model) : ICommand;
