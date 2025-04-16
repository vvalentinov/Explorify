using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Login;

public record LoginQuery(LoginRequestModel Model)
    : IQuery<(IdentityResponseModel IdentityModel, string RefreshToken)>;
