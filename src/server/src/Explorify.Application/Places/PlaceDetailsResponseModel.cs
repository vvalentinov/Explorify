namespace Explorify.Application.Places;

public class PlaceDetailsResponseModel
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public IEnumerable<string> ImagesUrls { get; set; } = [];
}
