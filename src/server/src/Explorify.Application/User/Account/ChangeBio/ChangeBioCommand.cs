using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeBio;

public record ChangeBioCommand(Guid UserId, string Bio)
    : ICommand;
