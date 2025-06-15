namespace Explorify.Application.Admin.GetUsers;

public class UserDetailsDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public string ProfileImageUrl { get; set; } = string.Empty;
}
