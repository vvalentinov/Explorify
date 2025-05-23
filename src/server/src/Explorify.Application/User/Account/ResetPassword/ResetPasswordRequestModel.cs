namespace Explorify.Application.User.Account.ResetPassword;

public class ResetPasswordRequestModel
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;
}
