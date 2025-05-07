namespace Explorify.Application.Abstractions.Models;

public class UserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = default!;

    public string? Email { get; set; }

    public string? ProfileImageUrl { get; set; }
}
