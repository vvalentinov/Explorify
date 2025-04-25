using FluentValidation;

using static Explorify.Domain.Constants.PlaceConstants;
using static Explorify.Domain.Constants.ImageConstants;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceRequestModelValidator
    : AbstractValidator<UploadPlaceRequestModel>
{
    public UploadPlaceRequestModelValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage(PlaceNameRequiredError)
            .MinimumLength(PlaceNameMinLength)
            .WithMessage(PlaceNameMinLengthError)
            .MaximumLength(PlaceNameMaxLength)
            .WithMessage(PlaceNameMaxLengthError);

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage(PlaceDescriptionRequiredError)
            .MinimumLength(PlaceDescriptionMinLength)
            .WithMessage(PlaceDescriptionMinLengthError)
            .MaximumLength(PlaceDescriptionMaxLength)
            .WithMessage(PlaceDescriptionMaxLengthError);

        RuleFor(x => x.Files)
            .Must(files => files.Count >= 1 && files.Count <= 10)
            .WithMessage(PlaceImagesCountError)
            .Must(files => files.All(f => AllowedImageMIMETypes.Contains(f.ContentType)))
            .WithMessage(AllImagesMustBeValidTypesError);
    }
}
