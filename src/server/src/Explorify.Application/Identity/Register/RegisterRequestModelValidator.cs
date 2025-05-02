using FluentValidation;

using static Explorify.Domain.Constants.ApplicationUserConstants;
using static Explorify.Domain.Constants.ApplicationUserConstants.ErrorMessages;

namespace Explorify.Application.Identity.Register;

public class RegisterRequestModelValidator
    : AbstractValidator<RegisterRequestModel>
{
    public RegisterRequestModelValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty()
            .WithMessage(UserNameEmptyError)
            .MinimumLength(UserNameMinLength)
            .WithMessage(UserNameMinLengthError)
            .MaximumLength(UserNameMaxLength)
            .WithMessage(UserNameMaxLengthError);

        RuleFor(x => x.Password)
           .NotEmpty()
           .WithMessage(PasswordEmptyError)
           .MinimumLength(PasswordMinLength)
           .WithMessage(PasswordMinLengthError);

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage(EmailEmptyError)
            .EmailAddress()
            .WithMessage(EmailInvalidError);
    }
}
