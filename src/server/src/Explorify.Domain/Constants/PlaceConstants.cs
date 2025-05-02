namespace Explorify.Domain.Constants;

public static class PlaceConstants
{
    public const int PlaceNameMinLength = 2;
    public const int PlaceNameMaxLength = 100;

    public const int PlaceDescriptionMinLength = 100;
    public const int PlaceDescriptionMaxLength = 2000;

    public static class ErrorMessages
    {
        public const string PlaceNameRequiredError = "Place name is required!";
        public static readonly string PlaceNameMaxLengthError = $"Place name must not exceed {PlaceNameMaxLength} characters!";
        public static readonly string PlaceNameMinLengthError = $"Place name must be at least {PlaceNameMinLength} characters long!";

        public const string PlaceDescriptionRequiredError = "Place description is required!";
        public static readonly string PlaceDescriptionMinLengthError = $"Place description must be at least {PlaceDescriptionMinLength} characters long!";
        public static readonly string PlaceDescriptionMaxLengthError = $"Place description must not exceed {PlaceDescriptionMaxLength} characters!";

        public const string PlaceImagesCountError = "Place images count must be between 1 and 10!";
    }
}
