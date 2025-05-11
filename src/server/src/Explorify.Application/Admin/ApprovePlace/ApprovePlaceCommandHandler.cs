using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.ApprovePlace;

public class ApprovePlaceCommandHandler
    : ICommandHandler<ApprovePlaceCommand>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public ApprovePlaceCommandHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result> Handle(
        ApprovePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await _repository.GetByIdAsync<Place>(request.PlaceId);

        if (place == null)
        {
            var error = new Error("No place with id found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        place.IsApproved = true;

        await _userService.IncreaseUserPointsAsync(place.UserId.ToString(), 10);

        await _repository.SaveChangesAsync();

        return Result.Success("Successfully approved place!");
    }
}
