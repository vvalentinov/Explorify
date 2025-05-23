using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangePassword;

public record ChangePasswordCommand(
    Guid UserId,
    string OldPassword,
    string NewPassword) : ICommand;
