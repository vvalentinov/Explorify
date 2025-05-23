using FluentValidation;

namespace Explorify.Application.User.Account.ChangePassword;

public class ChangePasswordRequestModelValidator
    : AbstractValidator<ChangePasswordRequestModel>
{
    public ChangePasswordRequestModelValidator()
    {
        RuleFor(x => x.OldPassword)
            .NotEmpty()
            .WithMessage("Old password cannot be empty!");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("New password cannot be empty!");
    }
}
