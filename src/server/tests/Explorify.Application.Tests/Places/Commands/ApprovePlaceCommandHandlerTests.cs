using Dapper;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Admin.Place.ApprovePlace;
using Explorify.Application.Badges;
using Explorify.Application.Notification;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Moq;
using Xunit;

using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

namespace Explorify.Application.Tests.Places.Commands;

public class ApprovePlaceCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldApprovePlaceAndGrantPointsAndNotify()
    {
        // Arrange
        var context = TestDbContextFactory.CreateWithSeedData();
        var repository = new FakeRepository(context);

        var userServiceMock = new Mock<IUserService>();
        var badgeServiceMock = new Mock<IBadgeService>();
        var notificationQueueMock = new Mock<INotificationQueueService>();

        var userId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // Owner
        var placeId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var approverId = Guid.NewGuid(); // Admin

        userServiceMock
            .Setup(s => s.IncreaseUserPointsAsync(userId, 10))
            .ReturnsAsync(Result.Success(10));

        badgeServiceMock
            .Setup(s => s.TryGrantPointThresholdBadgesAsync(userId))
            .ReturnsAsync(new List<BadgeGrantResult>());

        badgeServiceMock
            .Setup(s => s.TryGrantFirstPlaceBadgeAsync(userId))
            .ReturnsAsync((BadgeGrantResult?)null);

        notificationQueueMock
            .Setup(n => n.FlushAsync())
            .Returns(Task.CompletedTask);

        notificationQueueMock
            .Setup(n => n.GetPendingNotifications())
            .Returns(new List<Domain.Entities.Notification>());

        // Use real in-memory Sqlite connection for Dapper queries
        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        // Create dummy tables and seed minimal data for Dapper to work
        var createUserTable = "CREATE TABLE AspNetUsers (Id TEXT PRIMARY KEY, UserName TEXT);";
        var createFollowTable = "CREATE TABLE UserFollows (FolloweeId TEXT, FollowerId TEXT);";

        await connection.ExecuteAsync(createUserTable);
        await connection.ExecuteAsync(createFollowTable);

        await connection.ExecuteAsync(
            "INSERT INTO AspNetUsers (Id, UserName) VALUES (@Id, @UserName);",
            new { Id = userId.ToString(), UserName = "SeedUser" });

        // No followers added

        var handler = new ApprovePlaceCommandHandler(
            repository,
            userServiceMock.Object,
            connection,
            badgeServiceMock.Object,
            notificationQueueMock.Object
        );

        var command = new ApprovePlaceCommand(placeId, approverId);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.SuccessMessage.Should().Be("Successfully approved place!");

        var approvedPlace = await repository.GetByIdAsync<Domain.Entities.Place>(placeId);
        approvedPlace!.IsApproved.Should().BeTrue();

        userServiceMock.Verify(s => s.IncreaseUserPointsAsync(userId, 10), Times.Once);
        badgeServiceMock.Verify(s => s.TryGrantPointThresholdBadgesAsync(userId), Times.Once);
        notificationQueueMock.Verify(s => s.QueueNotification(
            It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>()),
            Times.AtLeastOnce);
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenPlaceDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateWithSeedData();
        var repository = new FakeRepository(context);

        var userServiceMock = new Mock<IUserService>();
        var badgeServiceMock = new Mock<IBadgeService>();
        var notificationQueueMock = new Mock<INotificationQueueService>();

        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var handler = new ApprovePlaceCommandHandler(
            repository,
            userServiceMock.Object,
            connection,
            badgeServiceMock.Object,
            notificationQueueMock.Object
        );

        var command = new ApprovePlaceCommand(Guid.NewGuid(), Guid.NewGuid());

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().NotBeNull();
        result.Error!.Description.Should().Be(NoPlaceWithIdError);
    }

    [Fact]
    public async Task Handle_ShouldSkipOwnerNotification_WhenUserApprovesOwnPlace()
    {
        var context = TestDbContextFactory.CreateWithSeedData();
        var repository = new FakeRepository(context);

        var userServiceMock = new Mock<IUserService>();
        var badgeServiceMock = new Mock<IBadgeService>();
        var notificationQueueMock = new Mock<INotificationQueueService>();

        var userId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        userServiceMock.Setup(s => s.IncreaseUserPointsAsync(userId, 10))
            .ReturnsAsync(Result.Success(10));

        badgeServiceMock.Setup(s => s.TryGrantPointThresholdBadgesAsync(userId))
            .ReturnsAsync(new List<BadgeGrantResult>());

        badgeServiceMock.Setup(s => s.TryGrantFirstPlaceBadgeAsync(userId))
            .ReturnsAsync((BadgeGrantResult?)null);

        notificationQueueMock.Setup(n => n.GetPendingNotifications()).Returns(new List<Domain.Entities.Notification>());
        notificationQueueMock.Setup(n => n.FlushAsync()).Returns(Task.CompletedTask);

        using var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();
        await connection.ExecuteAsync("CREATE TABLE AspNetUsers (Id TEXT PRIMARY KEY, UserName TEXT);");
        await connection.ExecuteAsync("CREATE TABLE UserFollows (FolloweeId TEXT, FollowerId TEXT);");

        var handler = new ApprovePlaceCommandHandler(
            repository,
            userServiceMock.Object,
            connection,
            badgeServiceMock.Object,
            notificationQueueMock.Object
        );

        var command = new ApprovePlaceCommand(Guid.Parse("22222222-2222-2222-2222-222222222222"), userId);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();

        // Owner notification should not be called
        notificationQueueMock.Verify(n => n.QueueNotification(
            It.Is<Guid>(s => s == userId), // senderId
            It.Is<Guid>(r => r == userId), // receiverId
            It.Is<string>(m => m.Contains("approved")), // content
            It.IsAny<string>()
        ), Times.Never);
    }


}
