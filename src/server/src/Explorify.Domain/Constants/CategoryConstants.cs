namespace Explorify.Domain.Constants;

public static class CategoryConstants
{
    public const int CategoryNameMaxLength = 100;
    public const int CategoryDescriptionMaxLength = 400;

    public static class ErrorMessages
    {
        public const string NoCategoryWithIdError = "Category with given id doesnt exist!";
        public const string NoCategoryWithNameError = "No category with given name was found!";
        public const string NoSubcategoryInGivenCategoryError = "Subcategory in the given category was not found!";
    }
}
