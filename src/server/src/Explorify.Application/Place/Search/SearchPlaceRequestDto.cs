namespace Explorify.Application.Place.Search;

public class SearchPlaceRequestDto
{
    public string? Name { get; set; }

    public int? CategoryId { get; set; }

    public int? SubcategoryId { get; set; }

    public int? CountryId { get; set; }

    public List<int>? Tags { get; set; }

    public string? Status { get; set; }

    public SearchContext Context { get; set; }
}
