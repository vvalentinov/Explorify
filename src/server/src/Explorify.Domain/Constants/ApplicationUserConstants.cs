namespace Explorify.Domain.Constants;

public static class ApplicationUserConstants
{
    public const int UserNameMinLength = 2;
    public const int UserNameMaxLength = 50;

    public const int PasswordMinLength = 6;

    public const int UserFollowPoints = 2;
    public const int UserPlaceUploadPoints = 10;
    public const int UserReviewUploadPoints = 5;

    public static class ErrorMessages
    {
        // Username
        public const string UserNameEmptyError = "Username cannot be empty!";
        public static readonly string UserNameMinLengthError = $"Username must be at least {UserNameMinLength} characters!";
        public static readonly string UserNameMaxLengthError = $"Username must not exceed {UserNameMaxLength} characters!";

        // Password
        public const string PasswordEmptyError = "Password cannot be empty!";
        public static readonly string PasswordMinLengthError = $"Password must be at least {PasswordMinLength} characters!";

        // Email
        public const string EmailEmptyError = "Email cannot be empty!";
        public const string EmailInvalidError = "Email is not valid!";

        // Other
        public const string NoUserWithIdFoundError = "No user with given id found!";
    }

    public static class SuccessMessages
    {
        public const string PasswordChangeSuccess = "Successfully changed password!";

        public static string UsernameChangeSuccess(string username)
            => $"Successfully changed your username to: {username}";
    }
}
