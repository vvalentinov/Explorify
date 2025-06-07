using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Place.Search;

public interface IPlaceSearchQueryValidator
{
    Task<Result> Validate(
        SearchPlaceRequestDto dto,
        Guid currentUserId,
        bool isCurrUserAdmin,
        bool isUserAuthenticated);
}
