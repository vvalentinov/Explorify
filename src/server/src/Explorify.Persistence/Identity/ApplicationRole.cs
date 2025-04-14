using Explorify.Domain.Abstractions.Contracts;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Persistence.Identity;

public class ApplicationRole :
    IdentityRole<Guid>,
    IAuditInfo,
    IDeletableEntity
{
    public ApplicationRole(string name)
        : base(name)
    {
    }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedOn { get; set; }
}
