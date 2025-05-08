using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class ReviewsLikes : BaseModel
{
    public Guid ReviewId { get; set; }

    public Review Review { get; set; } = default!;

    public Guid UserId { get; set; }
}
