using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.User.Account.ChangeProfileImage;

public record ChangeProfileImageCommand(
    string UserId,
    UploadFile File) : ICommand<string>;
