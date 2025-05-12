using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Notifications.GetUnreadNotificationsCount;

public record GetUnreadNotificationsCountQuery(Guid UserId)
    : IQuery<int>;
