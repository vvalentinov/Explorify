using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

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
        var place = await _repository.GetByIdAsync<Place>(request.Model.PlaceId);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<ReviewsListResponseModel>(error);
        }

        var query = _repository
            .AllAsNoTracking<Review>()
            .Include(x => x.Photos)
            .Where(x => x.IsApproved && x.PlaceId == request.Model.PlaceId && x.UserId != place.UserId);

        var recordsCount = await query.CountAsync(cancellationToken);

        switch (request.Model.Order)
        {
            case ReviewsOrderEnum.Newest:
                query = query.OrderByDescending(x => x.CreatedOn);
                break;
            case ReviewsOrderEnum.Oldest:
                query = query.OrderBy(x => x.CreatedOn);
                break;
            case ReviewsOrderEnum.MostHelpful:
                query = query.OrderByDescending(x => x.Likes);
                break;
            default:
                break;
        }

        var reviewsData = await query
            .Skip((request.Model.Page - 1) * 6)
            .Take(6)
            .ToListAsync(cancellationToken);

        var userIds = reviewsData.Select(r => r.UserId).Distinct();
        var reviewIds = reviewsData.Select(r => r.Id);

        var usersMap = await _userService.GetUsersReviewDtosByIdsAsync(userIds);
        var likedReviewIds = await _userService.GetLikedReviewIdsByUserAsync(request.UserId.ToString(), reviewIds);

        var reviews = reviewsData.Select(review =>
        {
            var userDto = usersMap[review.UserId];
            userDto.HasLikedReview = likedReviewIds.Contains(review.Id);

            return new ReviewResponseModel
            {
                Id = review.Id,
                User = userDto,
                Likes = review.Likes,
                Rating = review.Rating,
                Content = review.Content,
                ImagesUrls = review.Photos.Select(x => x.Url),
            };

        }).ToList();

        var responseModel = new ReviewsListResponseModel
        {
            ItemsPerPage = 6,
            Reviews = reviews,
            RecordsCount = recordsCount,
            PageNumber = request.Model.Page,
        };

        return Result.Success(responseModel);
    }
}
