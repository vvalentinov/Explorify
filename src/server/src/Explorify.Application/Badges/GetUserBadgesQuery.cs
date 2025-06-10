using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Badges;

public record GetUserBadgesQuery(Guid UserId)
    : IQuery<List<BadgeDto>>;
