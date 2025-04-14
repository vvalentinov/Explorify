using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class Country : BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;

    public ICollection<Place> Places { get; set; }
        = new List<Place>();
}
