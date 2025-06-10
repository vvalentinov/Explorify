using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Leaderboard;

public record SearchUserQuery(
    string UserNameFilter,
    int Page) : IQuery<LeaderboardResult>;
