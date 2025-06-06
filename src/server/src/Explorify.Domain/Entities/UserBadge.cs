using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class UserBadge : BaseModel
{
    public Guid UserId { get; set; }

    public int BadgeId { get; set; }

    public Badge Badge { get; set; } = new();

    public DateTime EarnedOn { get; set; }
}
