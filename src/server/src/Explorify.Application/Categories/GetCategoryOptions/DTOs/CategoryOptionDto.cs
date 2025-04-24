namespace Explorify.Application.Categories.GetCategoryOptions.DTOs;

public class CategoryOptionDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public IEnumerable<SubcategoryOptionDto> Subcategories { get; set; } = [];
}
