using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeEmail;

public record ChangeEmailCommand(string UserId, string Token, string NewEmail)
    : ICommand;
