namespace Explorify.Domain.Abstractions.Contracts;

public interface IAuditInfo
{
    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}
