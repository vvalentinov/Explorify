namespace Explorify.Application.Notification;

public class NotificationListResponseModel
{
    public PaginationResponseModel Pagination { get; set; } = new();

    public IEnumerable<NotificationResponseModel> Notifications { get; set; } = [];
}
