using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.FavPlace.Add;

public record AddFavPlaceCommand(
    Guid PlaceId,
    Guid CurrentUserId) : ICommand;
