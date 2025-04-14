using Explorify.Domain.Abstractions.Contracts;

namespace Explorify.Domain.Abstractions.Models;

public abstract class BaseDeletableEntity<TKey>
    : BaseEntity<TKey>, IDeletableEntity
{
    public bool IsDeleted { get; set; }

    public DateTime? DeletedOn { get; set; }
}