using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class PlacePhoto : BaseDeletableEntity<int>
{
    public string Url { get; set; } = string.Empty;

    public Guid PlaceId { get; set; }

    public Place Place { get; set; } = default!;
}
