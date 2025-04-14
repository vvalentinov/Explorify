using Explorify.Persistence.Identity;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Explorify.Persistence.Seeding.Seeders;

public class RolesSeeder : ISeeder
{
    public async Task SeedAsync(
        ExplorifyDbContext dbContext,
        IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var roleManager = scope
            .ServiceProvider
            .GetRequiredService<RoleManager<ApplicationRole>>();

        await CreateRoleAsync(UserRoleName, roleManager);
        await CreateRoleAsync(AdminRoleName, roleManager);
    }

    private static async Task CreateRoleAsync(
        string roleName,
        RoleManager<ApplicationRole> roleManager)
    {
        var roleExists = await roleManager.Roles.AnyAsync(x => x.Name == roleName);

        if (roleExists == false)
        {
            var role = new ApplicationRole(roleName);

            var createResult = await roleManager.CreateAsync(role);

            if (createResult.Succeeded == false)
            {
                throw new Exception(string.Join(
                    Environment.NewLine,
                    createResult.Errors.Select(e => $"{e.Code}:{e.Description}")));
            }
        }
    }
}
