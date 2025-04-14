namespace Explorify.Domain.Abstractions.Contracts;

public interface IDeletableEntity
{
    public bool IsDeleted { get; set; }

    public DateTime? DeletedOn { get; set; }
}
