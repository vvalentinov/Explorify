using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.GetReviews;

public class GetReviewsQueryHandler
    : IQueryHandler<GetReviewsQuery, List<ReviewResponseModel>>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetReviewsQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<List<ReviewResponseModel>>> Handle(
        GetReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var place = await _repository.GetByIdAsync<Place>(request.PlaceId);

        if (place == null)
        {
            var error = new Error("No place with id found!", ErrorType.Validation);
            return Result.Failure<List<ReviewResponseModel>>(error);
        }

        var reviews = await _repository
            .AllAsNoTracking<Review>()
            .Include(x => x.Photos)
            .Where(x => x.PlaceId == request.PlaceId && x.UserId != place.UserId)
            .ToListAsync(cancellationToken);

        var models = new List<ReviewResponseModel>();

        foreach (var review in reviews)
        {
            var userDto = await _userService.GetUserReviewDtoById(review.UserId.ToString());

            models.Add(new ReviewResponseModel
            {
                User = userDto.Data,
                Rating = review.Rating,
                Content = review.Content,
                ImagesUrls = review.Photos.Select(x => x.Url),
            });
        }

        return Result.Success(models);
    }
}
