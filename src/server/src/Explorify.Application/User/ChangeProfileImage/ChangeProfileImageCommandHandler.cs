using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.ChangeProfileImage;

public class ChangeProfileImageCommandHandler
    : ICommandHandler<ChangeProfileImageCommand, string>
{
    private readonly IUserService _userService;
    private readonly IBlobService _blobService;

    public ChangeProfileImageCommandHandler(
        IUserService userService,
        IBlobService blobService)
    {
        _userService = userService;
        _blobService = blobService;
    }

    public async Task<Result<string>> Handle(
        ChangeProfileImageCommand request,
        CancellationToken cancellationToken)
    {
        var fileName = await _userService.GetUserProfileImageFileNameAsync(request.UserId);

        string url = await _blobService.UploadBlobAsync(
            request.File.Content,
            fileName ?? request.File.FileName,
            pathPrefix: "ProfileImages/",
            shouldGenerateUniqueName: fileName == null);

        await _userService.ChangeProfileImageAsync(request.UserId, url);

        return Result.Success<string>(url);
    }
}
