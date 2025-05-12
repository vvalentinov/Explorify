using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notifications.GetUnreadNotificationsCount;

public class GetUnreadNotificationsCountQueryHandler : IQueryHandler<GetUnreadNotificationsCountQuery, int>
{
    private readonly IRepository _repository;

    public GetUnreadNotificationsCountQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<int>> Handle(
        GetUnreadNotificationsCountQuery request,
        CancellationToken cancellationToken)
    {
        var count = await _repository
            .AllAsNoTracking<Notification>()
            .Where(x => x.ReceiverId == request.UserId && x.IsDeleted == false && x.IsRead == false)
            .CountAsync(cancellationToken);

        return Result.Success(count);
    }
}
