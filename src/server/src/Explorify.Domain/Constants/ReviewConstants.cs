namespace Explorify.Domain.Constants;

public static class ReviewConstants
{
    public const int ReviewRatingMin = 1;
    public const int ReviewRatingMax = 5;

    public const int ReviewContentMinLength = 100;
    public const int ReviewContentMaxLength = 1000;

    public static class ErrorMessages
    {
        public static readonly string ReviewRatingError = $"Review rating must be between {ReviewRatingMin} and {ReviewRatingMax}!";

        public static readonly string ReviewContentMinLenghtError = $"Review content cannot be less than {ReviewContentMinLength} characters!";
        public static readonly string ReviewContentMaxLenghtError = $"Review content cannot exceed {ReviewContentMaxLength} characters!";

        public const string ReviewContentEmtpyError = "Review content cannot be empty!";
    }
}
