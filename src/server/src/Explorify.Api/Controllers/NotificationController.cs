using Explorify.Api.Extensions;
using Explorify.Application.Notifications.Delete;
using Explorify.Application.Notifications.GetUserNotifications;
using Explorify.Application.Notifications.MarkNotificationAsRead;
using Explorify.Application.Notifications.GetUnreadNotificationsCount;

using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Explorify.Api.Controllers;

public class NotificationController : BaseController
{
    private readonly IMediator _mediator;

    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet(nameof(GetNotifications))]
    public async Task<IActionResult> GetNotifications(int page = 1)
    {
        var query = new GetUserNotificationsQuery(User.GetId(), page);
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpGet(nameof(GetUnreadNotificationsCount))]
    public async Task<IActionResult> GetUnreadNotificationsCount()
    {
        var query = new GetUnreadNotificationsCountQuery(User.GetId());
        var result = await _mediator.Send(query);
        return this.OkOrProblemDetails(result);
    }

    [HttpPut(nameof(MarkNotificationAsRead))]
    public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
    {
        var command = new MarkNotificationAsReadCommand(notificationId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(Delete))]
    public async Task<IActionResult> Delete(int notificationId)
    {
        var command = new DeleteNotificationCommand(notificationId, User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }
}
