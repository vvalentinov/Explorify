namespace Explorify.Application.User;

public class UserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string ProfileImageUrl { get; set; } = string.Empty;
}
