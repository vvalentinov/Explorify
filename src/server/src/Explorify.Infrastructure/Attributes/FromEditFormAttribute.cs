using Microsoft.AspNetCore.Mvc;
using Explorify.Infrastructure.Binders;

namespace Explorify.Infrastructure.Attributes;

public class FromEditFormAttribute : ModelBinderAttribute
{
    public FromEditFormAttribute()
        : base(typeof(EditPlaceRequestModelBinder))
    {
        
    }
}
