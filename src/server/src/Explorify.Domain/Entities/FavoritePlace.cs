namespace Explorify.Domain.Entities;

public class FavoritePlace
{
    public Guid PlaceId { get; set; }

    public Place Place { get; set; } = default!;

    public Guid UserId { get; set; }
}
