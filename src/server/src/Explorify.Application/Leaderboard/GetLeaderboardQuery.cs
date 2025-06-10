using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Leaderboard;

public record GetLeaderboardQuery(int Page)
    : IQuery<LeaderboardResult>;
