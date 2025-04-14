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
    }

    public static class PlaceConstants
    {
        public const int PlaceNameMaxLength = 100;
        public const int PlaceDescriptionMaxLength = 2000;
    }

    public static class ReviewConstants
    {
        public const int ReviewContentMaxLength = 1000;
    }
}
