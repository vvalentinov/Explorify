using Explorify.Application.Abstractions.Models;

using MediatR;

namespace Explorify.Application.Abstractions.Interfaces.Messaging;

public interface ICommand
    : IRequest<Result>
{
}

public interface ICommand<TResponse>
    : IRequest<Result<TResponse>>
{
}
