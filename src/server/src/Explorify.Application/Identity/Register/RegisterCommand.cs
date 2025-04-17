using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Register;

public record RegisterCommand(IdentityRequestModel Model)
    : ICommand<(IdentityResponseModel IdentityModel, string RefreshToken)>;
