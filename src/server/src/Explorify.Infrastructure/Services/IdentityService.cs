using System.Web;
using System.Security.Claims;

using Explorify.Domain.Entities;
using Explorify.Application.Identity;
using Explorify.Persistence.Identity;
using Explorify.Infrastructure.Extensions;
using Explorify.Application.Identity.Login;
using Explorify.Application.Identity.Register;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using static Explorify.Domain.Constants.ApplicationRoleConstants;
using static Explorify.Domain.Constants.IdentityConstants.ErrorMessages;
using static Explorify.Domain.Constants.IdentityConstants.SuccessMessages;

using Microsoft.AspNetCore.Identity;

namespace Explorify.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly IRepository _repository;
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(
        IRepository repository,
        ITokenService tokenService,
        IUserService userService,
        UserManager<ApplicationUser> userManager)
    {
        _repository = repository;
        _userService = userService;
        _tokenService = tokenService;

        _userManager = userManager;
    }

    public async Task<Result<AuthResponseModel>> LoginUserAsync(LoginRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is null)
        {
            var error = new Error(LoginFailedError, ErrorType.Validation);
            return Result.Failure<AuthResponseModel>(error);
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);

        if (passwordValid == false)
        {
            var error = new Error(LoginFailedError, ErrorType.Validation);
            return Result.Failure<AuthResponseModel>(error);
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
            ProfileImageUrl = user.ProfileImageUrl,
        };

        var authResponseModel = new AuthResponseModel
        {
            IdentityModel = identityResponseModel,
            RefreshToken = refreshToken
        };

        return Result.Success(authResponseModel, LoginSuccess);
    }

    public async Task<Result<AuthResponseModel>> RegisterUserAsync(RegisterRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is not null)
        {
            var error = new Error(TakenUserNameError, ErrorType.Validation);
            return Result.Failure<AuthResponseModel>(error);
        }

        user = new ApplicationUser { UserName = model.UserName };

        var createUserResult = await _userManager.CreateAsync(user, model.Password);

        if (createUserResult.Succeeded == false)
        {
            var errorType = ErrorType.Validation;

            if (createUserResult.HasDuplicateUserNameOrEmailErrors())
            {
                errorType = ErrorType.Conflict;
            }

            var error = new Error(CouldNotCreateUserError, errorType);
            return Result.Failure<AuthResponseModel>(error);
        }

        var addToUserRoleResult = await _userManager.AddToRoleAsync(user, UserRoleName);

        if (addToUserRoleResult.Succeeded == false)
        {
            var error = new Error(CouldNotAddUserToRoleError, ErrorType.Failure);
            return Result.Failure<AuthResponseModel>(error);
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

        var authResponseModel = new AuthResponseModel
        {
            RefreshToken = refreshToken,
            IdentityModel = identityResponseModel,
        };

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = HttpUtility.UrlEncode(token);

        await _userService.SendEmailConfirmationAsync(
            user.Id.ToString(),
            user.UserName ?? string.Empty,
            encodedToken,
            model.Email);

        return Result.Success(authResponseModel, RegisterSuccess);
    }
}
