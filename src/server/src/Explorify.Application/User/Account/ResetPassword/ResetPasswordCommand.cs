using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ResetPassword;

public record ResetPasswordCommand(
    string Email,
    string Token,
    string Password) : ICommand;
