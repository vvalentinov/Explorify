using MediatR;

namespace Explorify.Application.Identity.Register;

public record RegisterRequest(RegisterRequestModel Model)
    : IRequest<(IdentityResponseModel, string)>;
