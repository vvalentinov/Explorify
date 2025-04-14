using Explorify.Domain.Abstractions.Contracts;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Persistence.Identity;

public class ApplicationUser :
    IdentityUser<Guid>,
    IAuditInfo
{
    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}
