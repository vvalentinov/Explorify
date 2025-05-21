using FluentValidation;

using static Explorify.Domain.Constants.PlaceConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using static Explorify.Domain.Constants.ImageConstants;
using static Explorify.Domain.Constants.ImageConstants.ErrorMessages;

using static Explorify.Domain.Constants.ReviewConstants;
using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;

namespace Explorify.Api.DTOs.Validators;

public class UploadPlaceRequestDtoValidator
    : AbstractValidator<UploadPlaceRequestDto>
{
    public UploadPlaceRequestDtoValidator()
    {
        RuleFor(x => x.Name)
           .NotEmpty()
           .WithMessage(PlaceNameRequiredError)
           .MinimumLength(PlaceNameMinLength)
           .WithMessage(PlaceNameMinLengthError)
           .MaximumLength(PlaceNameMaxLength)
           .WithMessage(PlaceNameMaxLengthError);

        RuleFor(x => x.Address)
            .MinimumLength(5)
            .WithMessage("Address must be at least 5 characters long!")
            .MaximumLength(300)
            .WithMessage("Address must not exceed 300 characters!")
            .When(x => !string.IsNullOrWhiteSpace(x.Address));

        RuleFor(x => x.CategoryId)
            .GreaterThan(0)
            .WithMessage("Category Id must be a positive number!");

        RuleFor(x => x.SubcategoryId)
            .GreaterThan(0)
            .WithMessage("Category Id must be a positive number!");

        RuleFor(x => x.CountryId)
            .GreaterThan(0)
            .WithMessage("Country id must be a positive number!");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage(PlaceDescriptionRequiredError)
            .MinimumLength(PlaceDescriptionMinLength)
            .WithMessage(PlaceDescriptionMinLengthError)
            .MaximumLength(PlaceDescriptionMaxLength)
            .WithMessage(PlaceDescriptionMaxLengthError);

        RuleFor(x => x.ReviewRating)
            .InclusiveBetween(ReviewRatingMin, ReviewRatingMax)
            .WithMessage(ReviewRatingError);

        RuleFor(x => x.ReviewContent)
            .NotEmpty()
            .WithMessage(ReviewContentEmtpyError)
            .MinimumLength(ReviewContentMinLength)
            .WithMessage(ReviewContentMinLenghtError)
            .MaximumLength(ReviewContentMaxLength)
            .WithMessage(ReviewContentMaxLenghtError);

        RuleFor(x => x.Files)
            .Must(files => files.Count >= 1 && files.Count <= 10)
            .WithMessage(PlaceImagesCountError)
            .Must(files => files.All(file =>
                AllowedImageMIMETypes.Contains(file.ContentType) && file.Length > 0))
            .WithMessage(AllImagesMustBeValidTypesError);

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .When(x => x.Latitude.HasValue)
            .WithMessage("Latitude must be between -90 and 90 degrees.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .When(x => x.Longitude.HasValue)
            .WithMessage("Longitude must be between -180 and 180 degrees.");

        RuleFor(x => x.VibesIds)
            .Must(ids => ids == null || ids.All(id => id > 0))
            .WithMessage("All Vibe IDs must be greater than zero.");

        RuleFor(x => x.VibesIds)
            .Must(ids => ids == null || ids.Distinct().Count() == ids.Count)
            .WithMessage("Vibe IDs must not contain duplicates.");

    }
}
