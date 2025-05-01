using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeUserName;

public record ChangeUserNameCommand(Guid UserId, string NewUserName)
    : ICommand;
