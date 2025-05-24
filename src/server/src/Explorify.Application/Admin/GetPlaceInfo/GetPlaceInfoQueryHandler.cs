using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Places;
using Explorify.Application.Vibes;
using Explorify.Domain.Entities;
using Microsoft.EntityFrameworkCore;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

namespace Explorify.Application.Admin.GetPlaceInfo;

public class GetPlaceInfoQueryHandler
    : IQueryHandler<GetPlaceInfoQuery, AdminPlaceInfoResponseModel>
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;

    public GetPlaceInfoQueryHandler(
        IRepository repository,
        IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<Result<AdminPlaceInfoResponseModel>> Handle(
        GetPlaceInfoQuery request,
        CancellationToken cancellationToken)
    {
        var responseModel = await _repository
           .AllAsNoTracking<Domain.Entities.Place>(ignoreQueryFilters: true)
           .Select(x => new AdminPlaceInfoResponseModel
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
               IsDeleted = x.IsDeleted,
               IsApproved = x.IsApproved,
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
            return Result.Failure<AdminPlaceInfoResponseModel>(error);
        }

        var userReview = await _repository
            .AllAsNoTracking<Domain.Entities.Review>()
            .FirstOrDefaultAsync(x =>
                x.PlaceId == request.PlaceId && x.UserId == responseModel.UserId,
                cancellationToken);

        if (userReview == null)
        {
            var error = new Error("No user review for place was found!", ErrorType.Validation);
            return Result.Failure<AdminPlaceInfoResponseModel>(error);
        }

        responseModel.UserReviewRating = userReview.Rating;
        responseModel.UserReviewContent = userReview.Content;

        var userDto = (await _userService.GetUserDtoByIdAsync(responseModel.UserId.ToString())).Data;

        responseModel.UserName = userDto.UserName;
        responseModel.UserProfileImageUrl = userDto.ProfileImageUrl ?? string.Empty;

        return Result.Success(responseModel);
    }
}
