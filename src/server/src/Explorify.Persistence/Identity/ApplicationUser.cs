using Explorify.Domain.Entities;
using Explorify.Domain.Abstractions.Contracts;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Persistence.Identity;

public class ApplicationUser :
    IdentityUser<Guid>,
    IAuditInfo
{
    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public ICollection<Place> Places { get; set; }
        = new List<Place>();

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();
}
