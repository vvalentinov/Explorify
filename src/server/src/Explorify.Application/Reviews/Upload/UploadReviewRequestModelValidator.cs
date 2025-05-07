using FluentValidation;

namespace Explorify.Application.Reviews.Upload;

using static Explorify.Domain.Constants.ReviewConstants;
using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;

public class UploadReviewRequestModelValidator
    : AbstractValidator<UploadReviewRequestModel>
{
    public UploadReviewRequestModelValidator()
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

        RuleFor(x => x.PlaceId)
            .NotEmpty()
            .WithMessage("Place ID is required.");
    }
}
