namespace Explorify.Application.Place;

public class PlaceDisplayResponseModel
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SlugifiedName { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsDeleted { get; set; }
}
