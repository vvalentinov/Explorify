using Explorify.Application.Abstractions.Interfaces;

using Microsoft.Extensions.Hosting;

namespace Explorify.Infrastructure.Services;

public class EnvironmentService : IEnvironmentService
{
    private readonly IHostEnvironment _hostEnvironment;

    public EnvironmentService(IHostEnvironment hostEnvironment)
    {
        _hostEnvironment = hostEnvironment;
    }

    public string GetCurrentEnvironment()
        => _hostEnvironment.EnvironmentName;
}
