using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Notifications.GetUserNotifications;

public class GetUserNotificationsQueryHandler
    : IQueryHandler<GetUserNotificationsQuery, NotificationListResponseModel>
{
    private readonly IRepository _repository;

    public GetUserNotificationsQueryHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<NotificationListResponseModel>> Handle(
        GetUserNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository
            .AllAsNoTracking<Notification>()
            .Where(x => x.ReceiverId == request.UserId && x.IsDeleted == false);

        var recordsCount = await query.CountAsync(cancellationToken);

        var notifications = (IEnumerable<NotificationResponseModel>)await query
            .Skip((request.Page * 6) - 6)
            .Take(6)
            .Select(x => new NotificationResponseModel
            {
                Id = x.Id,
                Content = x.Content,
                IsRead = x.IsRead,
                CreatedOn = x.CreatedOn,
            }).ToListAsync(cancellationToken);

        var responseModel = new NotificationListResponseModel
        {
            ItemsPerPage = 6,
            Notifications = notifications,
            PageNumber = request.Page,
            RecordsCount = recordsCount,
        };

        return Result.Success(responseModel);
    }
}
