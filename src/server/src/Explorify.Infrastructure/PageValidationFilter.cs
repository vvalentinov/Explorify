using Microsoft.AspNetCore.Mvc.Filters;

namespace Explorify.Infrastructure;

public class PageValidationFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ActionArguments.TryGetValue("page", out var page) ||
            page == null ||
            (page is int pageNumber && pageNumber <= 0))
        {
            context.ActionArguments["page"] = 1;
        }

        base.OnActionExecuting(context);
    }
}
