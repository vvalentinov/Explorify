using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.FavPlace.Remove;

public record RemoveFavPlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId) : ICommand;
