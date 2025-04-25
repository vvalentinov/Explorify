using Explorify.Infrastructure.Binders;
using Microsoft.AspNetCore.Mvc;

namespace Explorify.Infrastructure.Attributes;

public class FromUploadFormAttribute : ModelBinderAttribute
{
    public FromUploadFormAttribute()
       : base(typeof(UploadPlaceRequestModelBinder))
    {
    }
}
