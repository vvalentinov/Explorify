using Explorify.Application.Abstractions.Models;

using MediatR;

namespace Explorify.Application.Abstractions.Interfaces.Messaging;

public interface IQuery<TResponse>
    : IRequest<Result<TResponse>>
{
}
