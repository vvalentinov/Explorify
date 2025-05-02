using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ConfirmEmail;

public record ConfirmEmailCommand(string UserId, string Token)
    : ICommand;
