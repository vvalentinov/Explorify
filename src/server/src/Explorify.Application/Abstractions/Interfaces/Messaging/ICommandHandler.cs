﻿using Explorify.Application.Abstractions.Models;

using MediatR;

namespace Explorify.Application.Abstractions.Interfaces.Messaging;

public interface ICommandHandler<TCommand>
    : IRequestHandler<TCommand, Result>
        where TCommand : ICommand
{
}

public interface ICommandHandler<TCommand, TResponse>
    : IRequestHandler<TCommand, Result<TResponse>>
        where TCommand : ICommand<TResponse>
{
}
