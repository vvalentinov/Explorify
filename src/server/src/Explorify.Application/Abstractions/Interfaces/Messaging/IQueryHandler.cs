using Explorify.Application.Abstractions.Models;

using MediatR;

namespace Explorify.Application.Abstractions.Interfaces.Messaging;

public interface IQueryHandler<TQuery, TResponse>
    : IRequestHandler<TQuery, Result<TResponse>>
        where TQuery : IQuery<TResponse>
{
}
