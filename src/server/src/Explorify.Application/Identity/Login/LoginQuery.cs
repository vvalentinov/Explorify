using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Login;

public record LoginQuery(IdentityRequestModel Model)
    : IQuery<(IdentityResponseModel IdentityModel, string RefreshToken)>;
