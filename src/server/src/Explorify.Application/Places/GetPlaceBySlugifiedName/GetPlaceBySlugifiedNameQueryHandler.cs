using Explorify.Domain.Entities;
using Explorify.Application.Vibes;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

namespace Explorify.Application.Places.GetPlaceBySlugifiedName;

public class GetPlaceBySlugifiedNameQueryHandler
    : IQueryHandler<GetPlaceBySlugifiedNameQuery, PlaceDetailsResponseModel>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly IWeatherInfoService _weatherInfoService;

    public GetPlaceBySlugifiedNameQueryHandler(
        IRepository repository,
        IUserService userService,
        IWeatherInfoService weatherInfoService)
    {
        _repository = repository;

        _userService = userService;
        _weatherInfoService = weatherInfoService;
    }

    public async Task<Result<PlaceDetailsResponseModel>> Handle(
        GetPlaceBySlugifiedNameQuery request,
        CancellationToken cancellationToken)
    {
        var responseModel = await _repository
            .AllAsNoTracking<Place>()
            .Where(x => x.IsApproved)
            .Select(x => new PlaceDetailsResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                SlugifiedName = x.SlugifiedName,
                UserId = x.UserId,
                Description = x.Description,
                ImagesUrls = x.Photos
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
                x => x.SlugifiedName == request.SlugifiedName,
                cancellationToken);

        if (responseModel == null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure<PlaceDetailsResponseModel>(error);
        }

        var userReview = await _repository
            .AllAsNoTracking<Review>()
            .FirstOrDefaultAsync(x =>
                x.PlaceId == responseModel.Id && x.UserId == responseModel.UserId,
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

        responseModel.WeatherData = await _weatherInfoService.GetWeatherInfo(
            responseModel.Coordinates.Latitude,
            responseModel.Coordinates.Longitude);

        return Result.Success(responseModel);
    }
}
