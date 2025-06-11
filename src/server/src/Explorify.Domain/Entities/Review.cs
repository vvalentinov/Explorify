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

    public bool IsApproved { get; set; }

    public bool IsCleaned { get; set; }

    public bool IsDeletedByAdmin { get; set; }

    public ICollection<ReviewPhoto> Photos { get; set; }
         = new List<ReviewPhoto>();

    public ICollection<ReviewsLikes> ReviewLikes { get; set; }
        = new List<ReviewsLikes>();

    public void Approve()
    {
        IsApproved = true;
        ModifiedOn = DateTime.UtcNow;
    }

    public void Unapprove()
    {
        IsApproved = false;
        ModifiedOn = DateTime.UtcNow;
    }

    public void MarkAsDeletedByAdmin()
    {
        IsDeletedByAdmin = true;
        ModifiedOn = DateTime.UtcNow;
    }

    public void RevertDeletion()
    {
        IsDeleted = false;
        DeletedOn = null;
        ModifiedOn = DateTime.UtcNow;
    }
}
