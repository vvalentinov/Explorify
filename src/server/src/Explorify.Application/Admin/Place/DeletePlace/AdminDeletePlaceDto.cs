namespace Explorify.Application.Admin.Place.DeletePlace;

public class AdminDeletePlaceDto
{
    public Guid PlaceId { get; set; }

    public string Reason { get; set; } = string.Empty;
}
