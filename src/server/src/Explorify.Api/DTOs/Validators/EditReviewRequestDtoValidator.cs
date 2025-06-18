using FluentValidation;

using static Explorify.Domain.Constants.ReviewConstants;
using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;

namespace Explorify.Api.DTOs.Validators;

public class EditReviewRequestDtoValidator
    : AbstractValidator<EditReviewRequestDto>
{
    public EditReviewRequestDtoValidator()
    {
        RuleFor(x => x.Rating)
           .InclusiveBetween(ReviewRatingMin, ReviewRatingMax)
           .WithMessage(ReviewRatingError);

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage(ReviewContentEmtpyError)
            .MinimumLength(ReviewContentMinLength)
            .WithMessage(ReviewContentMinLenghtError)
            .MaximumLength(ReviewContentMaxLength)
            .WithMessage(ReviewContentMaxLenghtError);

        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Review ID is required.");
    }
}
