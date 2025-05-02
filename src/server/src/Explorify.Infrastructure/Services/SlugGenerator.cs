using Slugify;
using Explorify.Application.Abstractions.Interfaces;

namespace Explorify.Infrastructure.Services;

public class SlugGenerator : ISlugGenerator
{
    public string GenerateSlug(string input)
        => new SlugHelper().GenerateSlug(input);
}
