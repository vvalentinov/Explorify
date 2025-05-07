using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class ReviewPhoto : BaseDeletableEntity<int>
{
    public string Url { get; set; } = string.Empty;

    public Guid ReviewId { get; set; }

    public Review Review { get; set; } = default!;
}
