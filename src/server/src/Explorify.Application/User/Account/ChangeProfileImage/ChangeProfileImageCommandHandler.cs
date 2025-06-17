using System.Data;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Dapper;

namespace Explorify.Application.User.Account.ChangeProfileImage;

public class ChangeProfileImageCommandHandler
    : ICommandHandler<ChangeProfileImageCommand, string>
{
    private readonly IBlobService _blobService;
    private readonly IImageService _imageService;
    private readonly IProfileService _profileService;

    private readonly IDbConnection _dbConnection;

    public ChangeProfileImageCommandHandler(
        IBlobService blobService,
        IImageService imageService,
        IProfileService profileService,
        IDbConnection dbConnection)
    {
        _blobService = blobService;
        _imageService = imageService;
        _profileService = profileService;

        _dbConnection = dbConnection;
    }

    public async Task<Result<string>> Handle(
        ChangeProfileImageCommand request,
        CancellationToken cancellationToken)
    {
        const string sql = "SELECT ProfileImageUrl FROM AspNetUsers WHERE Id = @UserId";

        var profilePicUrl = await _dbConnection.QueryFirstOrDefaultAsync<string?>(sql, new { request.UserId });

        string? fileName = null;

        if (profilePicUrl is not null)
        {
            fileName = profilePicUrl[(profilePicUrl.LastIndexOf('/') + 1)..];
        }

        var processedImg = await _imageService.ProcessProfileImageAsync(request.File);

        var url = await _blobService.UploadBlobAsync(
            processedImg.Content,
            fileName ?? processedImg.FileName,
            $"ProfileImages/",
            fileName == null);

        await _profileService.ChangeProfileImageAsync(request.UserId, url);

        return Result.Success<string>(url);
    }
}
