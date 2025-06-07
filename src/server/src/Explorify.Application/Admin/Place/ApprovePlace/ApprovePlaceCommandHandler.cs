using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using Dapper;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Admin.Place.ApprovePlace;

public class ApprovePlaceCommandHandler
    : ICommandHandler<ApprovePlaceCommand>
{
    private readonly IRepository _repository;

    private readonly IUserService _userService;
    private readonly INotificationService _notificationHubService;

    private readonly IDbConnection _dbConnection;

    public ApprovePlaceCommandHandler(
        IRepository repository,
        IUserService userService,
        INotificationService notificationHubService,
        IDbConnection dbConnection)
    {
        _repository = repository;

        _userService = userService;
        _notificationHubService = notificationHubService;

        _dbConnection = dbConnection;
    }

    public async Task<Result> Handle(
        ApprovePlaceCommand request,
        CancellationToken cancellationToken)
    {
        var place = await _repository
            .All<Domain.Entities.Place>()
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x =>
                x.Id == request.PlaceId,
                cancellationToken);

        if (place is null)
        {
            var error = new Error(NoPlaceWithIdError, ErrorType.Validation);
            return Result.Failure(error);
        }

        var isPlaceOwner = place.UserId == request.CurrentUserId;

        place.IsApproved = true;

        var review = place.Reviews.FirstOrDefault(x => x.UserId == place.UserId);

        if (review != null)
        {
            review.IsApproved = true;
        }

        await _userService.IncreaseUserPointsAsync(place.UserId.ToString(), UserPlaceUploadPoints);

        var followerIds = await _repository
            .AllAsNoTracking<Domain.Entities.UserFollow>()
            .Where(x => x.FolloweeId == place.UserId)
            .Select(x => x.FollowerId)
            .ToListAsync(cancellationToken);

        const string getUsernameSql = @"SELECT UserName FROM AspNetUsers WHERE Id = @UserId";
        var username = await _dbConnection.QueryFirstOrDefaultAsync<string>(getUsernameSql, new { place.UserId });

        if (followerIds.Count > 0)
        {
            var followerNotifications = followerIds.Select(followerId => new Domain.Entities.Notification
            {
                ReceiverId = followerId,
                SenderId = place.UserId,
                Content = $"{username} just uploaded a new place: \"{place.Name}\". Check it out!"
            }).ToList();

            await _repository.AddRangeAsync(followerNotifications);
        }

        if (!isPlaceOwner)
        {
            var notification = new Domain.Entities.Notification
            {
                ReceiverId = place.UserId,
                SenderId = request.CurrentUserId,
                Content = $"Great news! Your place \"{place.Name}\" just got the seal of approval. You've earned 10 adventure points – keep exploring!"
            };

            await _repository.AddAsync(notification);
        }
        
        await _repository.SaveChangesAsync();

        if (!isPlaceOwner)
        {
            await _notificationHubService.NotifyAsync("Admin approved your place upload!", place.UserId);
        }

        foreach (var followerId in followerIds.Take(50))
        {
            await _notificationHubService.NotifyAsync($"{username} uploaded a new place!", followerId);
        }

        return Result.Success("Successfully approved place!");
    }
}
