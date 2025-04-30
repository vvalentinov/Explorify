using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Category : BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;

    public string SlugifiedName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public int? ParentId { get; set; }

    public Category? Parent { get; set; }

    public ICollection<Place> Places { get; set; }
        = new List<Place>();

    public ICollection<Category> Children { get; set; }
        = new List<Category>();
}
