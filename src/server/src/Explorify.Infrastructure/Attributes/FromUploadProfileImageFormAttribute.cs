using Explorify.Infrastructure.Binders;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Infrastructure.Attributes;

public class FromUploadProfileImageFormAttribute
    : ModelBinderAttribute
{
    public FromUploadProfileImageFormAttribute()
       : base(typeof(UploadFileModelBinder))
    {
    }
}
