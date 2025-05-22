using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Places;
using Explorify.Application.Vibes;
using Explorify.Domain.Entities;
using Microsoft.EntityFrameworkCore;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

namespace Explorify.Application.Admin.GetUnapprovedPlace;

public class GetUnapprovedPlaceQueryHandler
    : IQueryHandler<GetUnapprovedPlaceQuery, UnapprovedPlaceResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetUnapprovedPlaceQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<UnapprovedPlaceResponseModel>> Handle(
        GetUnapprovedPlaceQuery request,
        CancellationToken cancellationToken)
    {
        var responseModel = await _repository
            .AllAsNoTracking<Place>()
            .Where(x => !x.IsApproved)
            .Select(x => new UnapprovedPlaceResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                UserId = x.UserId,
                Description = x.Description,
                ImagesUrls = x.Photos
                    .Where(x => !x.IsDeleted)
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(c => c.Url)
                    .ToList(),
                Coordinates = new PlaceCoordinates
                {
                    Latitude = (double)(x.Latitude ?? 0),
                    Longitude = (double)(x.Longitude ?? 0)
                },
                Tags = x.PlaceVibeAssignments
                    .Select(x => new VibeResponseModel
                    {
                        Id = x.PlaceVibeId,
                        Name = x.PlaceVibe.Name,
                    }).ToList(),
            }).FirstOrDefaultAsync(
                x => x.Id == request.PlaceId,
                cancellationToken);

        if (responseModel == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<UnapprovedPlaceResponseModel>(error);
        }

        var userReview = await _repository
            .AllAsNoTracking<Review>()
            .FirstOrDefaultAsync(x =>
                x.PlaceId == request.PlaceId && x.UserId == responseModel.UserId,
                cancellationToken);

        if (userReview == null)
        {
            var error = new Error("No user review for place was found!", ErrorType.Validation);
            return Result.Failure<UnapprovedPlaceResponseModel>(error);
        }

        responseModel.UserReviewRating = userReview.Rating;
        responseModel.UserReviewContent = userReview.Content;

        var userDto = (await _userService.GetUserDtoByIdAsync(responseModel.UserId.ToString())).Data;

        responseModel.UserName = userDto.UserName;
        responseModel.UserProfileImageUrl = userDto.ProfileImageUrl ?? string.Empty;

        return Result.Success(responseModel);
    }
}
