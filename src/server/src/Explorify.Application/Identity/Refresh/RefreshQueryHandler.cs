using System.Data;

using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.Identity.Refresh;

public class RefreshQueryHandler
    : IQueryHandler<RefreshQuery, AuthResponseModel>
{
    private readonly IDbConnection _dbConnection;

    private readonly ITokenService _tokenService;
    private readonly IIdentityService _identityService;

    public RefreshQueryHandler(
        IDbConnection dbConnection,
        ITokenService tokenService,
        IIdentityService identityService)
    {
        _dbConnection = dbConnection;

        _tokenService = tokenService;
        _identityService = identityService;
    }

    public async Task<Result<AuthResponseModel>> Handle(
        RefreshQuery request,
        CancellationToken cancellationToken)
    {
        var requestRefreshToken = request.RefreshToken;

        const string getRefreshTokenSql = @"
            SELECT
                Token,
                ExpiresOn,
                UserId
            FROM RefreshTokens
            WHERE Token = @Token";

        var refreshTokenRecord = await _dbConnection.QueryFirstOrDefaultAsync<RefreshToken>(
            getRefreshTokenSql,
            new { Token = requestRefreshToken });

        if (refreshTokenRecord == null || refreshTokenRecord.ExpiresOn < DateTime.UtcNow)
        {
            var error = new Error("Invalid or expired refresh token.", ErrorType.Validation);
            return Result.Failure<AuthResponseModel>(error);
        }

        var userClaims = await _identityService.GetUserClaims(refreshTokenRecord.UserId.ToString());

        var accessToken = _tokenService.GenerateAccessToken(userClaims.Data);
        var refreshToken = _tokenService.GenerateRefreshToken();

        const string updateRefreshTokenSql = @"
            UPDATE RefreshTokens
            SET Token = @NewToken, Expires = @NewExpires
            WHERE Token = @OldToken";

        await _dbConnection.ExecuteAsync(updateRefreshTokenSql, new
        {
            NewToken = refreshToken,
            NewExpires = DateTime.UtcNow.AddDays(7),
            OldToken = request.RefreshToken
        });

        var authResponse = new AuthResponseModel
        {
            //AccessToken = newAccessToken,
            //RefreshToken = newRefreshToken,
            //UserId = user.Id,
            //UserName = user.UserName,
            //IsAdmin = user.IsAdmin,
            //ProfileImageUrl = user.ProfileImageUrl
            IdentityModel = new IdentityResponseModel
            {
                AccessToken = accessToken,
            }
        };

        return Result.Success(authResponse);

    }
}
