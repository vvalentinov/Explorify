using Explorify.Application.Abstractions.Interfaces;

using Slugify;

namespace Explorify.Infrastructure;

public class SlugGenerator : ISlugGenerator
{
    public string GenerateSlug(string input)
    {
        var slugHelper = new SlugHelper();
        var slug = slugHelper.GenerateSlug(input);
        return slug;
    }
}
