using Explorify.Infrastructure.Binders;
using Microsoft.AspNetCore.Mvc;

namespace Explorify.Infrastructure.Attributes
{
    public class FromUploadPlaceFormAttribute : ModelBinderAttribute
    {
        public FromUploadPlaceFormAttribute()
       : base(typeof(UploadPlaceRequestModelBinder))
        {
        }
    }
}
