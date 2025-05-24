namespace Explorify.Application.Admin.Place.UnapprovePlace;

public class UnapprovePlaceCommandDto
{
    public Guid PlaceId { get; set; }

    public string Reason { get; set; } = string.Empty;
}
