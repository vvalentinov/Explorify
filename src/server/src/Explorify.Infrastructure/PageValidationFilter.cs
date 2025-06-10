using Microsoft.AspNetCore.Mvc.Filters;

namespace Explorify.Infrastructure;

public class PageValidationFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        foreach (var arg in context.ActionArguments.Values)
        {
            if (arg is int pageValue && pageValue <= 0)
            {
                context.ActionArguments["page"] = 1;
            }
            else if (arg is not null)
            {
                var pageProperty = arg.GetType().GetProperty("Page");

                if (pageProperty != null && pageProperty.PropertyType == typeof(int))
                {
                    var value = (int)pageProperty.GetValue(arg)!;

                    if (value <= 0)
                    {
                        pageProperty.SetValue(arg, 1);
                    }
                }
            }
        }

        base.OnActionExecuting(context);
    }
}
