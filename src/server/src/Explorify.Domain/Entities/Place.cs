using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Place : BaseDeletableEntity<Guid>
{
    public string Name { get; set; } = string.Empty;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string SlugifiedName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CountryId { get; set; }

    public Country Country { get; set; } = default!;

    public int CategoryId { get; set; }

    public Category Category { get; set; } = default!;

    public Guid UserId { get; set; }

    public bool IsApproved { get; set; }

    public string ThumbUrl { get; set; } = string.Empty;

    public string? Address { get; set; }

    public bool IsCleaned { get; set; }

    public bool IsDeletedByAdmin { get; set; }

    public ICollection<PlacePhoto> Photos { get; set; }
        = new List<PlacePhoto>();

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();

    public ICollection<PlaceVibeAssignment> PlaceVibeAssignments { get; set; }
        = new List<PlaceVibeAssignment>();

    public ICollection<FavoritePlace> FavoritePlaces { get; set; }
       = new List<FavoritePlace>();

    /// <summary>
    /// Marks the place as approved and approves the owner's review, if loaded.
    /// <para>Note: Reviews must be eagerly loaded before calling this method.</para>
    /// </summary>
    public void Approve()
    {
        IsApproved = true;

        var ownerReview = Reviews.FirstOrDefault(r => r.UserId == UserId);

        if (ownerReview is not null)
        {
            ownerReview.IsApproved = true;
        }
    }

    /// <summary>
    /// Marks the place as unapproved and unapproves the owner's review, if loaded.
    /// <para>Note: Reviews must be eagerly loaded before calling this method.</para>
    /// </summary>
    public void Unapprove()
    {
        IsApproved = false;

        var ownerReview = Reviews.FirstOrDefault(r => r.UserId == UserId);

        if (ownerReview is not null)
        {
            ownerReview.IsApproved = false;
        }
    }

    /// <summary>
    /// Marks the place as deleted along with its reviews, if loaded.
    /// <para>Note: Reviews must be eagerly loaded before calling this method.</para>
    /// </summary>
    public void MarkAsDeletedWithReviews(bool byAdmin = false)
    {
        IsDeleted = true;
        IsDeletedByAdmin = byAdmin;
        DeletedOn = DateTime.UtcNow;
        ModifiedOn = DateTime.UtcNow;

        foreach (var review in Reviews)
        {
            review.IsDeleted = true;
            review.DeletedOn = DateTime.UtcNow;
            review.ModifiedOn = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// Marks the place as not deleted along with its reviews, if loaded.
    /// <para>Note: Reviews must be eagerly loaded before calling this method.</para>
    /// </summary>
    public void RevertDeletion()
    {
        IsDeleted = false;
        DeletedOn = null;
        ModifiedOn = DateTime.UtcNow;

        foreach (var review in Reviews)
        {
            review.RevertDeletion();
        }
    }

    public void AssignCoordinates(decimal? lat, decimal? lng)
    {
        if (lat.HasValue && lng.HasValue)
        {
            Latitude = lat.Value;
            Longitude = lng.Value;
        }
    }

    public void AssignTags(IEnumerable<int> tagIds)
    {
        PlaceVibeAssignments = [.. tagIds.Select(id => new PlaceVibeAssignment { PlaceId = Id, PlaceVibeId = id })];
    }

    public void AssignPhotos(string thumbUrl, IEnumerable<string> otherUrls)
    {
        ThumbUrl = thumbUrl;
        Photos = [.. otherUrls.Select(url => new PlacePhoto { Url = url })];
    }
}
