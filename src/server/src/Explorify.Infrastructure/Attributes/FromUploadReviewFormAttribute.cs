using Explorify.Infrastructure.Binders;

using Microsoft.AspNetCore.Mvc;

namespace Explorify.Infrastructure.Attributes;

public class FromUploadReviewFormAttribute : ModelBinderAttribute
{
    public FromUploadReviewFormAttribute()
       : base(typeof(UploadReviewRequestModelBinder))
    {
    }
}
