namespace Explorify.Domain.Entities;

public class PlaceVibeAssignment
{
    public int PlaceVibeId { get; set; }

    public PlaceVibe PlaceVibe { get; set; } = default!;

    public Guid PlaceId { get; set; }

    public Place Place { get; set; } = default!;
}
