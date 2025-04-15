using Explorify.Application;
using Explorify.Persistence;
using System.Security.Claims;
using Explorify.Domain.Entities;
using Explorify.Application.Identity;
using Explorify.Persistence.Identity;
using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly ITokenService _tokenService;
    private readonly ExplorifyDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(
        ITokenService tokenService,
        UserManager<ApplicationUser> userManager,
        ExplorifyDbContext dbContext)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<(IdentityResponseModel, string)> LoginUserAsync(LoginRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName) ?? throw new InvalidOperationException("Login failed. Try, again!");

        var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);

        if (passwordValid == false)
        {
            throw new InvalidOperationException("Login failed. Try, again!");
        }

        var isAdmin = await _userManager.IsInRoleAsync(user, AdminRoleName);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
        };

        var userRoles = await _userManager.GetRolesAsync(user);

        foreach (string role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        var refreshTokenRecord = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresOn = DateTime.UtcNow.AddDays(7),
        };

        _dbContext.RefreshTokens.Add(refreshTokenRecord);
        await _dbContext.SaveChangesAsync();

        var identityResponseModel = new IdentityResponseModel
        {
            UserId = user.Id.ToString(),
            IsAdmin = isAdmin,
            UserName = user.UserName ?? string.Empty,
            AccessToken = accessToken
        };

        return (identityResponseModel, refreshToken);
    }

    public async Task<(IdentityResponseModel, string)> RegisterUserAsync(RegisterRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is not null)
        {
            throw new InvalidOperationException("Looks like username is taken!");
        }

        user = new ApplicationUser { UserName = model.UserName };

        var createUserResult = await _userManager.CreateAsync(user, model.Password);

        if (createUserResult.Succeeded == false)
        {
            var error = string.Join("; ", createUserResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException(error);
        }

        var addToUserRoleResult = await _userManager.AddToRoleAsync(user, UserRoleName);

        if (addToUserRoleResult.Succeeded == false)
        {
            var error = string.Join("; ", addToUserRoleResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException(error);
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Role, UserRoleName),
        };
        
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        var refreshTokenRecord = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            ExpiresOn = DateTime.UtcNow.AddDays(7),
        };

        _dbContext.RefreshTokens.Add(refreshTokenRecord);
        await _dbContext.SaveChangesAsync();

        var identityResponseModel = new IdentityResponseModel
        {
            IsAdmin = false,
            AccessToken = accessToken,
            UserId = user.Id.ToString(),
            UserName = user.UserName ?? string.Empty,
        };

        return (identityResponseModel, refreshToken);
    }
}
