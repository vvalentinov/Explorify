using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeEmail;

public record ChangeEmailCommand(
    string UserId,
    string Token,
    string NewEmail) : ICommand;
