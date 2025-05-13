namespace Explorify.Application;

public class PaginationResponseModel
{
    public int RecordsCount { get; set; }

    public int ItemsPerPage { get; set; }

    public int PageNumber { get; set; }

    public int PagesCount => (int)Math.Ceiling((double)RecordsCount / ItemsPerPage);
}
