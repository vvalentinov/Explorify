using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Review : BaseDeletableEntity<Guid>
{
    public string Content { get; set; } = string.Empty;

    public short Rating { get; set; }

    public int Likes { get; set; }

    public Guid PlaceId { get; set; }

    public Place Place { get; set; } = default!;

    public Guid UserId { get; set; }

    public ICollection<ReviewPhoto> Photos { get; set; }
         = new List<ReviewPhoto>();
}
