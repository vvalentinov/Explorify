using Explorify.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Explorify.Persistence.Seeding.Seeders;

public class CategoriesSeeder : ISeeder
{
    private readonly List<Category> _categories = [];
    private readonly IConfiguration _configuration;

    public CategoriesSeeder(IConfiguration configuration)
    {
        _configuration = configuration;
        AddNatureCategory();
        AddHistoricalCategory();
        //AddFoodAndDrinkCategory();
    }

    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        if (await dbContext.Categories.AnyAsync())
        {
            return;
        }

        await dbContext.Categories.AddRangeAsync(_categories);
    }

    private void AddFoodAndDrinkCategory()
    {
        var foodAndDrinkCategory = new Category
        {
            Name = "Food & Drink",
            Description = "Culinary destinations that celebrate local or international flavors. Great for foodies and casual diners alike."
        };

        var foodAndDrinkSubcategoriesNames = new List<string>
        {
            "Street Food",
            "Local Restaurant",
            "Pub",
            "Winery",
            "Brewery",
            "Food Market",
            "Dessert Shop",
            "Seafood Spot",
        };

        var foodAndDrinkSubcategories = foodAndDrinkSubcategoriesNames
            .Select(x => new Category
            {
                Name = x,
                Parent = foodAndDrinkCategory
            });

        _categories.Add(foodAndDrinkCategory);
        _categories.AddRange(foodAndDrinkSubcategories);
    }

    private void AddHistoricalCategory()
    {
        var historicalCategory = new Category
        {
            Name = "Historical",
            Description = "Locations that offer a glimpse into the past — showcasing heritage, architecture, and stories from ancient to modern history.",
            ImageUrl = _configuration["CategoriesUrls:Historical:Url"]!,
        };

        var historicalSubcategoriesNames = new List<string>
        {
            "Castle",
            "Palace",
            "Temple",
            "Cathedral",
            "Ancient Ruins",
            "Museum",
        };

        var historicalSubcategories = historicalSubcategoriesNames
            .Select(categoryName => new Category
            {
                Name = categoryName,
                Parent = historicalCategory,
                ImageUrl = _configuration[$"CategoriesUrls:Historical:{categoryName}"]!,
            });

        _categories.Add(historicalCategory);
        _categories.AddRange(historicalSubcategories);
    }

    private void AddNatureCategory()
    {
        var natureCategory = new Category
        {
            Name = "Nature",
            Description = "Places that highlight the natural beauty of the world. From relaxing beaches to dramatic mountains, these locations offer scenic landscapes and outdoor experiences.",
            ImageUrl = _configuration["CategoriesUrls:Nature:Url"]!,
        };

        var natureSubcategoriesNames = new List<string>
        {
            "Cave",
            "Beach",
            "Lake",
            "Waterfall",
            "Hot Spring"
        };

        var natureSubcategories = natureSubcategoriesNames
            .Select(categoryName => new Category
            {
                Name = categoryName,
                Parent = natureCategory,
                ImageUrl = _configuration[$"CategoriesUrls:Nature:{categoryName}"]!,
            });

        _categories.Add(natureCategory);
        _categories.AddRange(natureSubcategories);
    }
}
