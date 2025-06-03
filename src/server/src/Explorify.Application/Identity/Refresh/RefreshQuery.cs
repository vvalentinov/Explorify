using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Refresh;

public record RefreshQuery(string RefreshToken)
    : IQuery<AuthResponseModel>;
