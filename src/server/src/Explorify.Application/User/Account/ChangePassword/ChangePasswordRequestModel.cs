﻿namespace Explorify.Application.User.Account.ChangePassword;

public class ChangePasswordRequestModel
{
    public Guid UserId { get; set; }

    public string OldPassword { get; set; } = string.Empty;

    public string NewPassword { get; set; } = string.Empty;
}
