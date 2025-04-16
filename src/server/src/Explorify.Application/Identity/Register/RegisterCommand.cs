using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Identity.Register;

public record RegisterCommand(RegisterRequestModel Model)
    : ICommand<(IdentityResponseModel IdentityModel, string RefreshToken)>;
