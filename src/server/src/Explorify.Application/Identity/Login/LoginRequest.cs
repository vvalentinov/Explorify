using MediatR;

namespace Explorify.Application.Identity.Login;

public record LoginRequest(LoginRequestModel Model)
    : IRequest<(IdentityResponseModel, string)>;
