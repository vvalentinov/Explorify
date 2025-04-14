using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Category : BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int? ParentId { get; set; }

    public Category? Parent { get; set; }

    public ICollection<Place> Places { get; set; }
        = new List<Place>();
}
