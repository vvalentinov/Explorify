namespace Explorify.Application.Places;

public class PlacesListResponseModel
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<PlaceDisplayResponseModel> Places { get; set; } = [];
}
