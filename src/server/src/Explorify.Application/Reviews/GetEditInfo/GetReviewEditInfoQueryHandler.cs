using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Places.GetEditData;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Reviews.GetEditInfo;

public class GetReviewEditInfoQueryHandler :
    IQueryHandler<GetReviewEditInfoQuery, GetReviewEditInfoResponseModel>
{
    private readonly IRepository _repository;

    public GetReviewEditInfoQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<GetReviewEditInfoResponseModel>> Handle(
        GetReviewEditInfoQuery request,
        CancellationToken cancellationToken)
    {
        var review = await _repository
            .AllAsNoTracking<Review>()
            .Select(x => new GetReviewEditInfoResponseModel
            {
                Id = x.Id,
                Rating = x.Rating,
                Content = x.Content,
                UserId = x.UserId,
                Images = x.Photos.Select(photo => new ImageResponseModel
                {
                    Id = photo.Id,
                    Url = photo.Url,
                }).ToList()
            })
            .FirstOrDefaultAsync(x =>
                x.Id == request.ReviewId,
                cancellationToken);

        if (review == null)
        {
            var error = new Error("No review was found!", ErrorType.Validation);
            return Result.Failure<GetReviewEditInfoResponseModel>(error);
        }

        if (review.UserId != request.CurrentUserId)
        {
            var error = new Error("Only review owner can edit it!", ErrorType.Validation);
            return Result.Failure<GetReviewEditInfoResponseModel>(error);
        }

        return Result.Success(review);
    }
}
