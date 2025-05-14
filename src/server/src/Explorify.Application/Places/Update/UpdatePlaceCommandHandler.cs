using Explorify.Application.Abstractions.Interfaces.Messaging;
using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Places.Update;

public class UpdatePlaceCommandHandler
    : ICommandHandler<UpdatePlaceCommand>
{
    public Task<Result> Handle(
        UpdatePlaceCommand request,
        CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
