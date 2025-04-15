using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class RefreshToken : BaseDeletableEntity<Guid>
{
    public string Token { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public DateTime ExpiresOn { get; set; }
}
