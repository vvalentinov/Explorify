using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Vibes.GetVibes;

public record GetVibesQuery()
    : IQuery<IEnumerable<VibeResponseModel>>;
