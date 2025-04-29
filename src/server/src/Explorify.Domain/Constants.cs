namespace Explorify.Domain;

public static class Constants
{
    public static class ApplicationRoleConstants
    {
        public const string UserRoleName = "User";
        public const string AdminRoleName = "Administrator";
    }

    public static class CategoryConstants
    {
        public const int CategoryNameMaxLength = 100;
        public const int CategoryDescriptionMaxLength = 400;

        public const string NoCategoryWithIdError = "Category with given id doesnt exist!";
        public const string NoSubcategoryInGivenCategoryError = "Subcategory in the given category was not found!";
    }

    public static class PlaceConstants
    {
        public const int PlaceNameMinLength = 2;
        public const int PlaceNameMaxLength = 100;
        public const string PlaceNameRequiredError = "Place name is required!";
        public static readonly string PlaceNameMinLengthError = $"Place name must be at least {PlaceNameMinLength} characters long!";
        public static readonly string PlaceNameMaxLengthError = $"Place name must not exceed {PlaceNameMaxLength} characters!";

        public const int PlaceDescriptionMinLength = 100;
        public const int PlaceDescriptionMaxLength = 2000;
        public const string PlaceDescriptionRequiredError = "Place description is required!";
        public static readonly string PlaceDescriptionMinLengthError = $"Place description must be at least {PlaceDescriptionMinLength} characters long!";
        public static readonly string PlaceDescriptionMaxLengthError = $"Place description must not exceed {PlaceDescriptionMaxLength} characters!";

        public const string PlaceImagesCountError = "Place images count must be between 1 and 10!";
    }

    public static class ReviewConstants
    {
        public const int ReviewRatingMin = 1;
        public const int ReviewRatingMax = 5;

        public static readonly string ReviewRatingError = $"Review rating must be between {ReviewRatingMin} and {ReviewRatingMax}!";

        public const int ReviewContentMinLength = 100;
        public const int ReviewContentMaxLength = 1000;

        public static readonly string ReviewContentMinLenghtError = $"Review content cannot be less than {ReviewContentMinLength} characters!";
        public static readonly string ReviewContentMaxLenghtError = $"Review content cannot exceed {ReviewContentMaxLength} characters!";

        public const string ReviewContentEmtpyError = "Review content cannot be empty!";
    }

    public static class CountryConstants
    {
        public const string NoCountryWithIdError = "No country with given id was found!";
    }

    public static class ImageConstants
    {
        public static readonly string[] AllowedImageMIMETypes = ["image/jpeg", "image/png"];

        public const string OneImageRequiredError = "At least one image is required!";

        public static readonly string AllImagesMustBeValidTypesError = $"All uploaded files must be valid image types! Valid types: {string.Join(", ", AllowedImageMIMETypes)}";
    }

    public static class AzureBlobStorageConstants
    {
        public const string PlacesImagesPath = "PlacesImages/";
    }
}
