namespace Explorify.Application.Notifications;

public class NotificationResponseModel
{
    public int Id { get; set; }

    public string Content { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public DateTime CreatedOn { get; set; }
}
