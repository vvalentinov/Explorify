﻿namespace Explorify.Application.Categories;

public class CategoryResponseModel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SlugifiedName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}
