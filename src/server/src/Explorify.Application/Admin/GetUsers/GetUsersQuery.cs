using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetUsers;

public record GetUsersQuery(int Page) : IQuery<GetUsersQueryDto>;
