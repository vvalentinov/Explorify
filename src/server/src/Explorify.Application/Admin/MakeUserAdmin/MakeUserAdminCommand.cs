using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.MakeUserAdmin;

public record MakeUserAdminCommand(Guid UserId)
    : ICommand;
