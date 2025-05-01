using FluentValidation;

namespace Explorify.Application.User.ChangeUserName;

public class ChangeUserNameRequestModelValidator
    : AbstractValidator<ChangeUserNameRequestModel>
{
    public ChangeUserNameRequestModelValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty()
            .WithMessage("Username cannot be empty!")
            .MinimumLength(2)
            .WithMessage("UserName must be at least 2 characters long!")
            .MaximumLength(50)
            .WithMessage("UserName must not exceed 50 characters!");
    }
}
