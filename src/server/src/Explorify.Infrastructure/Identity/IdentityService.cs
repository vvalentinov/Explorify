using Explorify.Application;
using System.Security.Claims;
using Explorify.Domain.Entities;
using Explorify.Application.Identity;
using Explorify.Persistence.Identity;
using Explorify.Application.Identity.Models;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationRoleConstants;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly IRepository _repository;
    private readonly ITokenService _tokenService;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(
        IRepository repository,
        ITokenService tokenService,
        UserManager<ApplicationUser> userManager)
    {
        _repository = repository;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> LoginUserAsync(IdentityRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is null)
        {
            var error = new Error("Login failed. Try, again!", ErrorType.Validation);
            return Result.Failure<(IdentityResponseModel Identity, string RefreshToken)>(error);
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);

        if (passwordValid == false)
        {
            var error = new Error("Login failed. Try, again!", ErrorType.Validation);
            return Result.Failure<(IdentityResponseModel Identity, string RefreshToken)>(error);
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
            UserId = user.Id,
            Token = refreshToken,
            ExpiresOn = DateTime.UtcNow.AddDays(7),
        };

        await _repository.AddAsync(refreshTokenRecord);
        await _repository.SaveChangesAsync();

        var identityResponseModel = new IdentityResponseModel
        {
            IsAdmin = isAdmin,
            AccessToken = accessToken,
            UserId = user.Id.ToString(),
            UserName = user.UserName ?? string.Empty,
        };

        return Result.Success<(IdentityResponseModel IdentityModel, string RefreshToken)>(
            (identityResponseModel, refreshToken),
            "Successfull login!");
    }

    public async Task<Result<(IdentityResponseModel Identity, string RefreshToken)>> RegisterUserAsync(IdentityRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is not null)
        {
            var error = new Error("Looks like username is taken!", ErrorType.Validation);
            return Result.Failure<(IdentityResponseModel Identity, string RefreshToken)>(error);
        }

        user = new ApplicationUser { UserName = model.UserName };

        var createUserResult = await _userManager.CreateAsync(user, model.Password);

        if (createUserResult.Succeeded == false)
        {
            var errorType = ErrorType.Validation;

            if (createUserResult.Errors.Any(e => e.Code == "DuplicateUserName" ||
                e.Code == "DuplicateEmail"))
            {
                errorType = ErrorType.Conflict;
            }

            var error = new Error("Error: Could not create a user!", errorType);
            return Result.Failure<(IdentityResponseModel Identity, string RefreshToken)>(error);
        }

        var addToUserRoleResult = await _userManager.AddToRoleAsync(user, UserRoleName);

        if (addToUserRoleResult.Succeeded == false)
        {
            var error = new Error("Error: Could not add user to role!", ErrorType.Failure);
            return Result.Failure<(IdentityResponseModel Identity, string RefreshToken)>(error);
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

        await _repository.AddAsync(refreshTokenRecord);
        await _repository.SaveChangesAsync();

        var identityResponseModel = new IdentityResponseModel
        {
            IsAdmin = false,
            AccessToken = accessToken,
            UserId = user.Id.ToString(),
            UserName = user.UserName ?? string.Empty,
        };

        return Result.Success<(IdentityResponseModel IdentityModel, string RefreshToken)>(
            (identityResponseModel, refreshToken),
            "Successfull register!");
    }
}
