namespace Explorify.Application.Admin;

public class PlacesListModel
{
    public PaginationResponseModel Pagination { get; set; } = default!;

    public IEnumerable<PlaceResponseModel> Places { get; set; } = [];
}
