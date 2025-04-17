using FluentValidation;

namespace Explorify.Application.Identity.Models;

public class IdentityRequestModelValidator
    : AbstractValidator<IdentityRequestModel>
{
    private const int UserNameMinLength = 2;
    private const int UserNameMaxLength = 50;

    public IdentityRequestModelValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty()
            .WithMessage("Username is required!")
            .MinimumLength(UserNameMinLength)
            .WithMessage($"Username must be at least {UserNameMinLength} characters long.")
            .MaximumLength(UserNameMaxLength)
            .WithMessage($"Username must not exceed {UserNameMinLength} characters.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required!");
    }
}
