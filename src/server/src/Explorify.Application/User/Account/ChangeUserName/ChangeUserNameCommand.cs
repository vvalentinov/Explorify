using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeUserName;

public record ChangeUserNameCommand(Guid UserId, string NewUserName)
    : ICommand;
