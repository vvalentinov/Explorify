namespace Explorify.Application.Place.Delete;

public class DeletePlaceDto
{
    public Guid PlaceId { get; set; }

    public string? Reason { get; set; }
}
