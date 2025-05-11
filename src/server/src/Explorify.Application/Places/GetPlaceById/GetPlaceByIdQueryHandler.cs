using Explorify.Domain.Entities;
using Explorify.Application.Places.GetPlace;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.GetPlaceById;

public class GetPlaceByIdQueryHandler
    : IQueryHandler<GetPlaceByIdQuery, PlaceDetailsResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetPlaceByIdQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceByIdQuery request,
        CancellationToken cancellationToken)
    {
        var responseModel = await _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.IsApproved)
            .Include(x => x.Photos)
            .Select(x => new PlaceDetailsResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                UserId = x.UserId,
                Description = x.Description,
                ImagesUrls = x.Photos
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(c => c.Url)
                    .ToList(),
            }).FirstOrDefaultAsync(
                x => x.Id == request.PlaceId,
                cancellationToken);

        if (responseModel == null)
        {
            return Result.Failure<PlaceDetailsResponseModel>(new Error(
                NoPlaceWithIdError,
                ErrorType.Validation));
        }

        responseModel.ImagesUrls = responseModel
            .ImagesUrls
            .Where(x => Path.GetFileName(x).StartsWith("thumb_") == false);

        var userReview = await _repository
            .AllAsNoTracking<Review>()
            .FirstOrDefaultAsync(x =>
                x.PlaceId == request.PlaceId && x.UserId == responseModel.UserId,
                cancellationToken);

        if (userReview == null)
        {
            var error = new Error("No user review for place was found!", ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        responseModel.UserReviewRating = userReview.Rating;
        responseModel.UserReviewContent = userReview.Content;

        var userDto = (await _userService.GetUserDtoByIdAsync(responseModel.UserId.ToString())).Data;

        responseModel.UserName = userDto.UserName;
        responseModel.UserProfileImageUrl = userDto.ProfileImageUrl ?? string.Empty;

        return Result.Success(responseModel);
    }
}
