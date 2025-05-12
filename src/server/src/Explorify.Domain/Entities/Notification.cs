using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Notification : BaseDeletableEntity<int>
{
    public string Content { get; set; } = string.Empty;

    public Guid SenderId { get; set; }

    public Guid ReceiverId { get; set; }

    public bool IsRead { get; set; }
}
