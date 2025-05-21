using FluentValidation;

using static Explorify.Domain.Constants.PlaceConstants;
using static Explorify.Domain.Constants.PlaceConstants.ErrorMessages;

using static Explorify.Domain.Constants.ImageConstants;
using static Explorify.Domain.Constants.ImageConstants.ErrorMessages;

using static Explorify.Domain.Constants.ReviewConstants;
using static Explorify.Domain.Constants.ReviewConstants.ErrorMessages;

namespace Explorify.Api.DTOs.Validators;

public class EditPlaceRequestDtoValidator
    : AbstractValidator<EditPlaceRequestDto>
{
    public EditPlaceRequestDtoValidator()
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
            .WithMessage("Subcategory Id must be a positive number!");

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

        RuleFor(x => x)
            .Must(x =>
                (!x.Latitude.HasValue && !x.Longitude.HasValue) ||
                (x.Latitude.HasValue && x.Longitude.HasValue))
            .WithMessage("Both Latitude and Longitude must be provided together, or neither.");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .When(x => x.Latitude.HasValue)
            .WithMessage("Latitude must be between -90 and 90 degrees.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .When(x => x.Longitude.HasValue)
            .WithMessage("Longitude must be between -180 and 180 degrees.");

        RuleFor(x => x.TagsIds)
            .Must(ids => ids == null || ids.All(id => id > 0))
            .WithMessage("All Vibe IDs must be greater than zero.");

        RuleFor(x => x.TagsIds)
            .Must(ids => ids == null || ids.Distinct().Count() == ids.Count)
            .WithMessage("Vibe IDs must not contain duplicates.");

        RuleFor(x => x.ToBeRemovedImagesIds)
            .Must(ids => ids == null || ids.All(id => id > 0))
            .WithMessage("All images IDs must be greater than zero.");

        RuleFor(x => x.ToBeRemovedImagesIds)
            .Must(ids => ids == null || ids.Distinct().Count() == ids.Count)
            .WithMessage("Images IDs must not contain duplicates.");

        RuleFor(x => x.PlaceId)
            .NotEmpty()
            .WithMessage("Place ID is required!");

        RuleFor(x => x.NewImages)
            .Must(files => files.Count <= 10)
            .WithMessage("You can upload up to 10 new images.")
            .Must(files => files.All(file => AllowedImageMIMETypes.Contains(file.ContentType)))
            .WithMessage(AllImagesMustBeValidTypesError)
            .Must(files => files.All(file => file.Length > 0))
            .WithMessage("All files must not be empty!");
    }
}
