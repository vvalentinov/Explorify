using Explorify.Domain.Entities;
using Explorify.Domain.Abstractions.Contracts;

using Microsoft.AspNetCore.Identity;
using Explorify.Application.Abstractions.Models;

namespace Explorify.Persistence.Identity;

public class ApplicationUser :
    IdentityUser<Guid>,
    IAuditInfo
{
    public string? ProfileImageUrl { get; set; }

    public int Points { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public ICollection<Place> Places { get; set; }
        = new List<Place>();

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();

    public ICollection<ReviewsLikes> ReviewLikes { get; set; }
        = new List<ReviewsLikes>();

    public UserDto MapToUserDto()
    {
        var dto = new UserDto
        {
            Id = Id,
            Email = Email,
            UserName = UserName ?? string.Empty,
            ProfileImageUrl = ProfileImageUrl,
        };

        return dto;
    }

    public UserReviewDto MapToUserReviewDto()
    {
        var dto = new UserReviewDto
        {
            UserName = UserName ?? string.Empty,
            ProfileImageUrl = ProfileImageUrl,
        };

        return dto;
    }
}
