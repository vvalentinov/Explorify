using System.Data;

using Explorify.Application.Vibes;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;
using static Explorify.Application.Place.GetPlace.GetPlaceSqlGenerator;

using Dapper;

namespace Explorify.Application.Place.GetPlace.GetPlaceById;

public class GetPlaceByIdQueryHandler
    : IQueryHandler<GetPlaceByIdQuery, PlaceDetailsResponseModel>
{
    private readonly IDbConnection _dbConnection;

    public GetPlaceByIdQueryHandler(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceByIdQuery request,
        CancellationToken cancellationToken)
    {
        string sql = request.IsForAdmin ? GetPlaceByIdForAdmin() : GetPlaceByIdForUser();

        using var multi = await _dbConnection.QueryMultipleAsync(
            sql,
            new
            {
                request.PlaceId,
                UserId = request.CurrentUserId
            });

        var place = await multi.ReadFirstOrDefaultAsync<PlaceDetailsResponseModel>();

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        place.ImagesUrls = [.. await multi.ReadAsync<string>()];
        place.Tags = [.. await multi.ReadAsync<VibeResponseModel>()];

        return Result.Success(place);
    }
}
