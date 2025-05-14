using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class PlaceVibe : BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;
}
