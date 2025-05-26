using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Place.Edit.GetEditData;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Reviews.GetEditInfo;

public class GetReviewEditInfoQueryHandler :
    IQueryHandler<GetReviewEditInfoQuery, GetReviewEditInfoResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetReviewEditInfoQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<GetReviewEditInfoResponseModel>> Handle(
        GetReviewEditInfoQuery request,
        CancellationToken cancellationToken)
    {
        const string sql = @"
            SELECT 
                r.Id,
                r.Rating,
                r.Content,
                r.UserId,
                p.Id AS PhotoId,
                p.Url
            FROM Reviews r
            INNER JOIN Places pl ON r.PlaceId = pl.Id
            LEFT JOIN ReviewPhotos p ON r.Id = p.ReviewId
            WHERE r.Id = @ReviewId AND r.IsDeleted = 0 AND pl.UserId <> @CurrentUserId";

        var reviewDictionary = new Dictionary<Guid, GetReviewEditInfoResponseModel>();

        var result = await _dbConnection.QueryAsync<
            GetReviewEditInfoResponseModel,
            ImageResponseModel,
            GetReviewEditInfoResponseModel>(
            sql,
            (review, photo) =>
            {
                if (!reviewDictionary.TryGetValue(review.Id, out var currentReview))
                {
                    currentReview = review;
                    currentReview.Images = new List<ImageResponseModel>();
                    reviewDictionary.Add(currentReview.Id, currentReview);
                }

                if (photo != null && photo.Id != 0)
                {
                    currentReview.Images.Add(new ImageResponseModel
                    {
                        Id = photo.Id,
                        Url = photo.Url
                    });
                }

                return currentReview;
            },
            param: new { request.ReviewId, request.CurrentUserId },
            splitOn: "PhotoId"
       );

        var reviewResult = reviewDictionary.Values.FirstOrDefault();

        if (reviewResult == null)
        {
            var error = new Error("No review was found, or it's for your own place!", ErrorType.Validation);
            return Result.Failure<GetReviewEditInfoResponseModel>(error);
        }

        if (reviewResult.UserId != request.CurrentUserId)
        {
            var error = new Error("Only review owner can edit it!", ErrorType.Validation);
            return Result.Failure<GetReviewEditInfoResponseModel>(error);
        }

        return Result.Success(reviewResult);
    }
}
