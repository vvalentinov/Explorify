using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Home;

public record GetHomeDataQuery
    : IQuery<GetHomeDataResponseModel>;