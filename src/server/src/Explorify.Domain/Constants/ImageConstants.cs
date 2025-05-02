namespace Explorify.Domain.Constants;

public static class ImageConstants
{
    public static readonly string[] AllowedImageMIMETypes = ["image/jpeg", "image/png"];

    public static class ErrorMessages
    {
        public const string OneImageRequiredError = "At least one image is required!";

        public static readonly string AllImagesMustBeValidTypesError = $"All uploaded files must be valid image types! Valid types: {string.Join(", ", AllowedImageMIMETypes)}";
    }
}
