using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User;

public record ResetPasswordCommand(
    string Email,
    string Token,
    string Password) : ICommand;
