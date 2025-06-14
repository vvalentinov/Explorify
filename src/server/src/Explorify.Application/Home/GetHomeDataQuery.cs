using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Home;

public record GetHomeDataQuery(Guid CurrentUserId)
    : IQuery<GetHomeDataResponseModel>;