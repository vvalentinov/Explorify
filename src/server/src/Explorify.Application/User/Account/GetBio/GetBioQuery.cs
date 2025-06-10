using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.GetBio;

public record GetBioQuery(Guid UserId)
    : IQuery<GetBioResponseModel>;
