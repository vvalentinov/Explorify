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
using Explorify.Application.Abstractions.Email;

namespace Explorify.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly IRepository _repository;
    private readonly ITokenService _tokenService;
    private readonly IProfileService _profileService;

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailSender _emailSender;

    public IdentityService(
        IRepository repository,
        ITokenService tokenService,
        IProfileService profileService,
        UserManager<ApplicationUser> userManager,
        IEmailSender emailSender)
    {
        _repository = repository;
        _tokenService = tokenService;

        _userManager = userManager;
        _emailSender = emailSender;
        _profileService = profileService;
    }

    public async Task<Result<IEnumerable<Claim>>> GetUserClaims(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            var error = new Error("No user with id found!", ErrorType.Validation);
            return Result.Failure<IEnumerable<Claim>>(error);
        }

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

        return Result.Success((IEnumerable<Claim>)claims);
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

    public async Task<Result<AuthResponseModel>> LoginWithGoogleAsync(ClaimsPrincipal? claimsPrincipal)
    {
        if (claimsPrincipal is null)
        {
            throw new ArgumentNullException();
        }

        var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);

        if (email is null)
        {
            throw new ArgumentNullException();
        }

        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            var newUser = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser);

            if (!result.Succeeded)
            {
                throw new ArgumentNullException();
            }

            user = newUser;
        }

        var loginProvider = "Google";
        var providerKey = email;
        var existingLoginUser = await _userManager.FindByLoginAsync(loginProvider, providerKey);

        // Only add login if it's not already associated
        if (existingLoginUser is null)
        {
            var loginResult = await _userManager.AddLoginAsync(user, new UserLoginInfo(loginProvider, providerKey, loginProvider));

            if (!loginResult.Succeeded)
            {
                return Result.Failure<AuthResponseModel>(new Error("Failed to link Google login.", ErrorType.Failure));
            }
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

        return Result.Success(authResponseModel);
    }

    public async Task<Result<AuthResponseModel>> RegisterUserAsync(RegisterRequestModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user is not null)
        {
            var error = new Error(TakenUserNameError, ErrorType.Validation);
            return Result.Failure<AuthResponseModel>(error);
        }

        user = new ApplicationUser { UserName = model.UserName, Email = model.Email };

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

        await _emailSender.SendWelcomeEmailAsync(model.Email);

        await _profileService.SendEmailChangeAsync(model.Email, user.Id.ToString());

        return Result.Success(authResponseModel, RegisterSuccess);
    }
}
