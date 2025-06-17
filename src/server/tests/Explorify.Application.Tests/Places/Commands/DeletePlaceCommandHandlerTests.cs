using Explorify.Application.Place.Delete;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using Moq;
using Xunit;
using FluentAssertions;

using static Explorify.Domain.Constants.PlaceConstants.SuccessMessages;

namespace Explorify.Application.Tests.Places.Commands;

public class DeletePlaceCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldDeleteUserOwnedApprovedPlace()
    {
        // Arrange
        var context = TestDbContextFactory.CreateWithSeedData();
        var repository = new FakeRepository(context);

        var notificationServiceMock = new Mock<INotificationService>();
        var userServiceMock = new Mock<IUserService>();

        var handler = new DeletePlaceCommandHandler(
            repository,
            notificationServiceMock.Object,
            userServiceMock.Object
        );

        var userId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var placeId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        var command = new DeletePlaceCommand(
            new DeletePlaceDto { PlaceId = placeId, Reason = null },
            userId,
            false
        );

        userServiceMock
            .Setup(u => u.DecreaseUserPointsAsync(userId, 10))
            .ReturnsAsync(Result.Success(10));

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.SuccessMessage.Should().Be(PlaceDeleteSuccess);
    }
}
