using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class UserFollow : BaseDeletableEntity
{
    public Guid FollowerId { get; set; }

    public Guid FolloweeId { get; set; }
}
