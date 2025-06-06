using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Badge : BaseDeletableEntity<int>
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}
