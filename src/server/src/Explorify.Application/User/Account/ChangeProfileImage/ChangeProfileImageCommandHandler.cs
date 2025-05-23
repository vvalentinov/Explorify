using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeProfileImage;

public class ChangeProfileImageCommandHandler
    : ICommandHandler<ChangeProfileImageCommand, string>
{
    private readonly IUserService _userService;
    private readonly IBlobService _blobService;
    private readonly IImageService _imageService;
    private readonly IProfileService _profileService;

    public ChangeProfileImageCommandHandler(
        IUserService userService,
        IBlobService blobService,
        IImageService imageService,
        IProfileService profileService)
    {
        _userService = userService;
        _blobService = blobService;
        _imageService = imageService;
        _profileService = profileService;
    }

    public async Task<Result<string>> Handle(
        ChangeProfileImageCommand request,
        CancellationToken cancellationToken)
    {
        var fileName = await _userService.GetUserProfileImageFileNameAsync(request.UserId);

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
