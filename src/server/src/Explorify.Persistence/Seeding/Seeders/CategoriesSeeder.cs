using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Persistence.Seeding.Seeders;

public class CategoriesSeeder : ISeeder
{
    private readonly ISlugGenerator _slugGenerator;
    private readonly List<Category> _categories = [];

    private const string _baseStorageUrl = "https://explorifystorageaccount.blob.core.windows.net/explorify/Categories";

    public CategoriesSeeder(ISlugGenerator slugGenerator)
    {
        _slugGenerator = slugGenerator;

        AddNatureCategory();
        AddHistoricalCategory();
        AddFoodAndDrinkCategory();
        AddAdventureCategory();
        AddWildlifeAndNatureEncountersCategory();
        AddShoppingCategory();
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
        const string foodAndDrinkUrl = $"{_baseStorageUrl}/FoodAndDrink";

        string categoryName = "Food & Drink";

        var foodAndDrinkCategory = new Category
        {
            Name = categoryName,
            SlugifiedName = _slugGenerator.GenerateSlug(categoryName),
            Description = "Culinary destinations that celebrate local or international flavors. Great for foodies and casual diners alike.",
            ImageUrl = $"{foodAndDrinkUrl}/foodAndDrink85bb2534-a8f1-4a10-9ba1-7573b4552635.jpg",
        };

        var foodAndDrinkSubcategories = new List<Category>
        {
            new Category
            {
                Name = "Street Food",
                SlugifiedName = _slugGenerator.GenerateSlug("Street Food"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/streetFood70fb30f7-ef50-43a1-a892-1efd46511378.jpg"
            },
            new Category
            {
                Name = "Local Restaurant",
                SlugifiedName = _slugGenerator.GenerateSlug("Local Restaurant"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/localRestaurant53f8e481-3715-468f-bd1c-1124fd358409.jpg"
            },
            new Category
            {
                Name = "Winery",
                SlugifiedName = _slugGenerator.GenerateSlug("Winery"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/winery6967e24d-5e44-48f3-8791-37d8e710e491.jpg"
            },
            new Category
            {
                Name = "Food Market",
                SlugifiedName = _slugGenerator.GenerateSlug("Food Market"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/foodMarket640ee650-3ce2-4a60-8676-fcecabc43495.jpg"
            },
            new Category
            {
                Name = "Dessert Shop",
                SlugifiedName = _slugGenerator.GenerateSlug("Dessert Shop"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/dessertShope81ff093-57e6-4197-8406-13c9175898bd.jpg"
            },
            new Category
            {
                Name = "Seafood Spot",
                SlugifiedName = _slugGenerator.GenerateSlug("Seafood Spot"),
                Parent = foodAndDrinkCategory,
                ImageUrl = $"{foodAndDrinkUrl}/seafoodShopbfbf2407-903d-4df6-8c10-86bf6a00ca65.jpg"
            }
        };

        _categories.Add(foodAndDrinkCategory);
        _categories.AddRange(foodAndDrinkSubcategories);
    }

    private void AddHistoricalCategory()
    {
        const string historicalUrl = $"{_baseStorageUrl}/Historical";

        var historicalCategory = new Category
        {
            Name = "Historical",
            SlugifiedName = _slugGenerator.GenerateSlug("Historical"),
            Description = "Locations that offer a glimpse into the past — showcasing heritage, architecture, and stories from ancient to modern history.",
            ImageUrl = $"{historicalUrl}/historical540c761c-e229-486e-9124-2a1d295e739d.jpg",
        };

        var historicalSubcategories = new List<Category>
        {
            new Category
            {
                Name = "Castle",
                SlugifiedName = _slugGenerator.GenerateSlug("Castle"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/castle11a74840-67d8-442a-bf34-3610170c4b05.jpg"
            },
            new Category
            {
                Name = "Palace",
                SlugifiedName = _slugGenerator.GenerateSlug("Palace"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/palace306299f1-37cc-47ae-bc33-3324a8a1b3b3.jpg"
            },
            new Category
            {
                Name = "Temple",
                SlugifiedName = _slugGenerator.GenerateSlug("Temple"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/templea76df3f1-711e-4db6-8953-52355256525f.jpg"
            },
            new Category
            {
                Name = "Cathedral",
                SlugifiedName = _slugGenerator.GenerateSlug("Cathedral"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/cathedral5edde76c-ac81-4693-889f-65c980246564.jpg"
            },
            new Category
            {
                Name = "Ancient Ruins",
                SlugifiedName = _slugGenerator.GenerateSlug("Ancient Ruins"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/ancientRuinsf5ec10d0-0b2d-4106-9231-551fa638e3b1.jpg"
            },
            new Category
            {
                Name = "Museum",
                SlugifiedName = _slugGenerator.GenerateSlug("Museum"),
                Parent = historicalCategory,
                ImageUrl = $"{historicalUrl}/museum14060d0f-dd6f-4857-9d71-323c80b79952.jpg"
            }
        };

        _categories.Add(historicalCategory);
        _categories.AddRange(historicalSubcategories);
    }

    private void AddNatureCategory()
    {
        const string natureUrl = $"{_baseStorageUrl}/Nature";

        var natureCategory = new Category
        {
            Name = "Nature",
            SlugifiedName = _slugGenerator.GenerateSlug("Nature"),
            Description = "Places that highlight the natural beauty of the world. From relaxing beaches to dramatic mountains, these locations offer scenic landscapes and outdoor experiences.",
            ImageUrl = $"{natureUrl}/natureac89e8bd-0ced-4653-ad22-2b3cb603452e.jpg",
        };

        var natureSubcategories = new List<Category>
        {
            new Category
            {
                Name = "Cave",
                SlugifiedName = _slugGenerator.GenerateSlug("Cave"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/cavece38b152-cb4b-449c-8dc8-0c2bcdab004e.jpg"
            },
            new Category
            {
                Name = "Beach",
                SlugifiedName = _slugGenerator.GenerateSlug("Beach"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/beachd8f63177-e364-48ee-ba1e-984825be213d.jpg"
            },
            new Category
            {
                Name = "Lake",
                SlugifiedName = _slugGenerator.GenerateSlug("Lake"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/lakec481963d-f707-4358-86ab-459fe66d9a49.jpg"
            },
            new Category
            {
                Name = "Waterfall",
                SlugifiedName = _slugGenerator.GenerateSlug("Waterfall"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/waterfalladc7b349-9a24-405f-badf-6b03c1199ea6.jpg"
            },
            new Category
            {
                Name = "Hot Spring",
                SlugifiedName = _slugGenerator.GenerateSlug("Hot Spring"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/hotSpring3aa82029-f4db-47ba-8dd6-4ae8671b140f.jpg"
            },
            new Category
            {
                Name = "Natural Park",
                SlugifiedName = _slugGenerator.GenerateSlug("Natural Park"),
                Parent = natureCategory,
                ImageUrl = $"{natureUrl}/naturalParkb1815cea-72b6-44d7-8c54-a4a320485710.jpg"
            }
        };

        _categories.Add(natureCategory);
        _categories.AddRange(natureSubcategories);
    }

    private void AddAdventureCategory()
    {
        const string adventureUrl = $"{_baseStorageUrl}/Adventure";

        var adventureCategory = new Category
        {
            Name = "Adventure & Activities",
            SlugifiedName = _slugGenerator.GenerateSlug("Adventure & Activities"),
            Description = "For thrill-seekers or anyone looking to get active — from extreme sports to outdoor excursions.",
            ImageUrl = $"{adventureUrl}/adventurea918314b-3db0-4ac1-8ea3-797db4108ba2.jpg",
        };

        var adventureSubcategories = new List<Category>
        {
            new Category
            {
                Name = "ATV Trail",
                SlugifiedName = _slugGenerator.GenerateSlug("ATV Trail"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/atvTrail75537871-f20d-4c81-ac60-b1b76ae8be75.jpg"
            },
            new Category
            {
                Name = "Hiking Trail",
                SlugifiedName = _slugGenerator.GenerateSlug("Hiking Trail"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/hikingTraild520fc84-66a7-4555-81eb-7db7b3150027.jpg"
            },
            new Category
            {
                Name = "Ziplining",
                SlugifiedName = _slugGenerator.GenerateSlug("Ziplining"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/ziplining8c86d527-17b4-4eeb-ba4a-9b13736352b4.jpg"
            },
            new Category
            {
                Name = "Bungee Jumping Site",
                SlugifiedName = _slugGenerator.GenerateSlug("Bungee Jumping Site"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/bungeeJumpingSite0462378b-e58e-4246-b85d-6eef1fcf2e35.jpg"
            },
            new Category
            {
                Name = "Paragliding Spot",
                SlugifiedName = _slugGenerator.GenerateSlug("Paragliding Spot"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/paraglidingSpot9f0f1946-0104-49c1-bf61-be00b76e93f9.jpg"
            },
            new Category
            {
                Name = "Kayaking Route",
                SlugifiedName = _slugGenerator.GenerateSlug("Kayaking Route"),
                Parent = adventureCategory,
                ImageUrl = $"{adventureUrl}/kayakingRoutefb2973a2-d53e-451e-8270-bb08dec8428e.jpg"
            }
        };

        _categories.Add(adventureCategory);
        _categories.AddRange(adventureSubcategories);
    }

    private void AddWildlifeAndNatureEncountersCategory()
    {
        const string wildlifeUrl = $"{_baseStorageUrl}/WildlifeAndNatureEncounters";

        var wildlifeCategory = new Category
        {
            Name = "Wildlife & Nature Encounters",
            SlugifiedName = _slugGenerator.GenerateSlug("Wildlife & Nature Encounters"),
            Description = "Locations that offer interaction with wildlife or observe animals in their natural or protected habitats.",
            ImageUrl = $"{wildlifeUrl}/wildlifeNatureEncounters2a4ad027-a6a4-4bda-93bb-ffa420921936.jpg",
        };

        var wildlifeSubcategories = new List<Category>
        {
            new Category
            {
                Name = "Animal Rescue Center",
                SlugifiedName = _slugGenerator.GenerateSlug("Animal Rescue Center"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/animalRescueCenter3d144719-78b6-4686-98cd-f009c2439c49.jpg"
            },
            new Category
            {
                Name = "Aquarium",
                SlugifiedName = _slugGenerator.GenerateSlug("Aquarium"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/aquarium0777e208-aaad-4983-8bd9-3f5f6951878b.jpg"
            },
            new Category
            {
                Name = "Zoo",
                SlugifiedName = _slugGenerator.GenerateSlug("Zoo"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/zoo4050bd22-6415-4333-9c06-bfa39908aa37.jpg"
            },
            new Category
            {
                Name = "Rainforest Reserve",
                SlugifiedName = _slugGenerator.GenerateSlug("Rainforest Reserve"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/rainforestReserve87e81444-ec79-4a42-8440-008e568bcd50.jpg"
            },
            new Category
            {
                Name = "Botanical Garden",
                SlugifiedName = _slugGenerator.GenerateSlug("Botanical Garden"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/botanicalGarden88d1a9c5-598d-44a6-be8d-889ba7dab285.jpg"
            },
            new Category
            {
                Name = "Safari Park",
                SlugifiedName = _slugGenerator.GenerateSlug("Safari Park"),
                Parent = wildlifeCategory,
                ImageUrl = $"{wildlifeUrl}/safariPark0397bc9e-c6db-42ff-a98a-21281912d939.jpg"
            }
        };

        _categories.Add(wildlifeCategory);
        _categories.AddRange(wildlifeSubcategories);
    }

    private void AddShoppingCategory()
    {
        const string shoppingUrl = $"{_baseStorageUrl}/Shopping";

        var shoppingCategory = new Category
        {
            Name = "Shopping",
            SlugifiedName = _slugGenerator.GenerateSlug("Shopping"),
            Description = "Spots to discover local products, fashion, art, or just enjoy retail therapy.",
            ImageUrl = $"{shoppingUrl}/shoppingfd11f3c3-9162-4022-bede-8e355356f93f.jpg",
        };

        var shoppingSubcategories = new List<Category>
        {
            new Category
            {
                Name = "Local Market",
                SlugifiedName = _slugGenerator.GenerateSlug("Local Market"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/localMarketcbba898c-4743-43a6-90dc-35f83f35f213.jpg"
            },
            new Category
            {
                Name = "Shopping Mall",
                SlugifiedName = _slugGenerator.GenerateSlug("Shopping Mall"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/shoppingMallf9824d6a-737d-464e-929a-c7ade2a9f864.jpg"
            },
            new Category
            {
                Name = "Souvenir Shop",
                SlugifiedName = _slugGenerator.GenerateSlug("Souvenir Shop"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/souvenirShope0ff111d-ac8e-4d2d-a0e6-1dcedbf3902f.jpg"
            },
            new Category
            {
                Name = "Boutique Store",
                SlugifiedName = _slugGenerator.GenerateSlug("Boutique Store"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/boutiqueStore77e17a08-4004-4717-9bda-556b4d3396eb.jpg"
            },
            new Category
            {
                Name = "Craft Market",
                SlugifiedName = _slugGenerator.GenerateSlug("Craft Market"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/craftMarketc9169a00-5f05-41bf-9a7a-e0ee7e5c5050.jpg"
            },
            new Category
            {
                Name = "Antique Store",
                SlugifiedName = _slugGenerator.GenerateSlug("Antique Store"),
                Parent = shoppingCategory,
                ImageUrl = $"{shoppingUrl}/antiqueStoreee94dd07-4cf4-4774-8237-0ed671822fb9.jpg"
            }
        };

        _categories.Add(shoppingCategory);
        _categories.AddRange(shoppingSubcategories);
    }
}
