using Explorify.Api.Extensions;
using Explorify.Infrastructure;
using Explorify.Application.Notification.Delete;
using Explorify.Application.Notification.DeleteAll;
using Explorify.Application.Notification.GetUserNotifications;
using Explorify.Application.Notification.MarkNotificationAsRead;
using Explorify.Application.Notification.MarkAllNotificationsAsRead;
using Explorify.Application.Notification.GetUnreadNotificationsCount;

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

    [PageValidationFilter]
    [HttpGet(nameof(GetNotifications))]
    public async Task<IActionResult> GetNotifications(int page)
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

    [HttpPut(nameof(MarkAllAsRead))]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var command = new MarkAllNotificationsAsReadCommand(User.GetId());
        var result = await _mediator.Send(command);
        return this.OkOrProblemDetails(result);
    }

    [HttpDelete(nameof(DeleteAll))]
    public async Task<IActionResult> DeleteAll()
    {
        var command = new DeleteAllNotificationsCommand(User.GetId());
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
