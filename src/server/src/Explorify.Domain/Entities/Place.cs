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

    public ICollection<PlacePhoto> Photos { get; set; }
        = new List<PlacePhoto>();

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();

    public ICollection<PlaceVibeAssignment> PlaceVibeAssignments { get; set; }
        = new List<PlaceVibeAssignment>();

    public ICollection<FavoritePlace> FavoritePlaces { get; set; }
       = new List<FavoritePlace>();
}
