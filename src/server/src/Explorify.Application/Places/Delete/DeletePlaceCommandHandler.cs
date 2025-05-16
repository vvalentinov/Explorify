using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Delete;

public class DeletePlaceCommandHandler
    : ICommandHandler<DeletePlaceCommand>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public DeletePlaceCommandHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result> Handle(
        DeletePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .All<Place>()
            .Include(p => p.Reviews)
                .ThenInclude(r => r.Photos)
            .Include(p => p.Photos)
            .Include(p => p.PlaceVibeAssignments)
            .Include(p => p.FavoritePlaces)
            .AsSplitQuery()
            .Where(p => p.Id == request.PlaceId)
            .FirstOrDefaultAsync(cancellationToken);

        if (place == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure();
        }

        if (!request.IsCurrUserAdmin && place.UserId != request.CurrentUserId)
        {
            return Result.Failure(new Error(
                "Only the place owner or an admin can delete the place!",
                ErrorType.Validation));
        }

        // Delete ReviewLikes
        var reviewIds = place.Reviews.Select(r => r.Id).ToList();

        var reviewLikes = await _repository
            .All<Domain.Entities.ReviewsLikes>()
            .Where(rl => reviewIds.Contains(rl.ReviewId))
            .ToListAsync(cancellationToken);

        foreach (var like in reviewLikes)
        {
            _repository.HardDelete(like);
        }

        // Soft delete ReviewPhotos
        var reviewPhotos = place.Reviews.SelectMany(r => r.Photos).ToList();
        foreach (var photo in reviewPhotos)
        {
            _repository.SoftDelete(photo);
        }

        // Soft delete Reviews
        foreach (var review in place.Reviews)
        {
            _repository.SoftDelete(review);
        }

        // Soft delete PlacePhotos
        foreach (var photo in place.Photos)
        {
            _repository.SoftDelete(photo);
        }

        // Hard delete VibeAssignments
        foreach (var assignment in place.PlaceVibeAssignments)
        {
            _repository.HardDelete(assignment);
        }

        foreach (var favPlace in place.FavoritePlaces)
        {
            _repository.HardDelete(favPlace);
        }

        _repository.SoftDelete(place);

        if (place.IsApproved)
        {
            place.IsApproved = false;

            await _userService.DecreaseUserPointsAsync(
                request.CurrentUserId.ToString(),
                10);
        }

        await _repository.SaveChangesAsync();

        return Result.Success();
    }
}
