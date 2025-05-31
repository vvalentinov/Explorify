using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.GetProfileInfo;

public record GetProfileInfoQuery(string UserId, Guid CurrentUserId)
    : IQuery<GetProfileInfoResponseModel>;
