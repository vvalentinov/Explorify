namespace Explorify.Application.Categories;

public class SubcategoriesResponseModel
{
    public string CategoryName { get; set; } = string.Empty;

    public string SlugifiedCategoryName { get; set; } = string.Empty;

    public string CategoryDescription { get; set; } = string.Empty;

    public IEnumerable<CategoryResponseModel> Subcategories { get; set; } = [];
}
