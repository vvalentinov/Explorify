using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.GetReviews;

public class GetReviewsQueryHandler
    : IQueryHandler<GetReviewsQuery, ReviewsListResponseModel>
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

    public async Task<Result<ReviewsListResponseModel>> Handle(
        GetReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var place = await _repository.GetByIdAsync<Place>(request.PlaceId);

        if (place == null)
        {
            var error = new Error("No place with id found!", ErrorType.Validation);
            return Result.Failure<ReviewsListResponseModel>(error);
        }

        var query = _repository
            .AllAsNoTracking<Review>()
            .Include(x => x.Photos)
            .Where(x => x.PlaceId == request.PlaceId && x.UserId != place.UserId);

        var recordsCount = await query.CountAsync(cancellationToken);

        query = query.OrderByDescending(x => x.CreatedOn);

        var reviewsData = await query
            .Skip((request.Page - 1) * 6)
            .Take(6)
            .ToListAsync(cancellationToken);

        var reviews = new List<ReviewResponseModel>();

        foreach (var review in reviewsData)
        {
            var userDto = await _userService.GetUserReviewDtoById(review.UserId.ToString());

            reviews.Add(new ReviewResponseModel
            {
                User = userDto.Data,
                Rating = review.Rating,
                Content = review.Content,
                ImagesUrls = review.Photos.Select(x => x.Url),
            });
        }

        var responseModel = new ReviewsListResponseModel
        {
            Reviews = reviews,
            RecordsCount = recordsCount,
            ItemsPerPage = 6,
            PageNumber = request.Page,
        };

        return Result.Success(responseModel);
    }
}
