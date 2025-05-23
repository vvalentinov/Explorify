using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationUserConstants;

using Quartz;

using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Explorify.Infrastructure.BackgroundJobs;

public class DeleteExpiredContentJob : IJob
{
    private readonly IRepository _repository;
    private readonly IBlobService _blobService;
    private readonly ILogger<DeleteExpiredContentJob> _logger;
    private readonly IUserService _userService;

    public DeleteExpiredContentJob(
        IRepository repository,
        IBlobService blobService,
        ILogger<DeleteExpiredContentJob> logger,
        IUserService userService)
    {
        _logger = logger;
        _userService = userService;
        _repository = repository;
        _blobService = blobService;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        // var cutoff = DateTime.UtcNow.AddDays(-30);
        var cutoff = DateTime.UtcNow.AddMinutes(-5);

        try
        {
            await DeleteExpiredPlaces(cutoff);
            await DeleteExpiredReviews(cutoff);

            _logger.LogInformation($"DeleteExpiredContentJob finished execution: {DateTime.UtcNow}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during DeleteExpiredContentJob.");
        }
    }

    private async Task DeleteExpiredPlaces(DateTime cutoff)
    {
        var expiredPlaces = await _repository
            .All<Place>(withDeleted: true)
            .Where(p =>
                p.IsDeleted &&
                p.DeletedOn <= cutoff &&
                !p.IsCleaned)
            .Include(p => p.Photos)
            .Include(p => p.FavoritePlaces)
            .Include(p => p.PlaceVibeAssignments)
            .AsSplitQuery()
            .ToListAsync();

        foreach (var place in expiredPlaces)
        {
            // Delete blobs -> place images
            foreach (var image in place.Photos)
            {
                await _blobService.DeleteBlobAsync(image.Url);
                _repository.SoftDelete(image);
            }

            // delete thumb url image
            await _blobService.DeleteBlobAsync(place.ThumbUrl);

            // hard delete the place tags
            foreach (var placeTagAssignment in place.PlaceVibeAssignments)
            {
                _repository.HardDelete(placeTagAssignment);
            }

            // hard delete the favorite places
            foreach (var favPlace in place.FavoritePlaces)
            {
                _repository.HardDelete(favPlace);
            }

            place.IsCleaned = true;

            if (place.IsApproved)
            {
               await _userService.DecreaseUserPointsAsync(place.UserId.ToString(), UserPlaceUploadPoints);
            }
        }

        await _repository.SaveChangesAsync();
    }

    private async Task DeleteExpiredReviews(DateTime cutoff)
    {
        var reviews = await _repository
            .All<Review>(withDeleted: true)
            .Where(review =>
                review.IsDeleted &&
                review.DeletedOn <= cutoff)
            .Include(x => x.Photos)
            .Include(x => x.ReviewLikes)
            .Include(x => x.Place)
            .AsSplitQuery()
            .ToListAsync();

        foreach (var review in reviews)
        {
            foreach (var photo in review.Photos)
            {
                await _blobService.DeleteBlobAsync(photo.Url);
                _repository.SoftDelete(photo);
            }

            foreach (var reviewLike in review.ReviewLikes)
            {
                _repository.HardDelete(reviewLike);
            }

            review.IsCleaned = true;

            if (review.IsApproved && review.UserId != review.Place.UserId )
            {
                await _userService.DecreaseUserPointsAsync(
                    review.UserId.ToString(),
                    UserReviewUploadPoints);
            }
        }

        await _repository.SaveChangesAsync();
    }
}
