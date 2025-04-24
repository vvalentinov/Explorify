using Explorify.Domain.Entities;
using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;
using Explorify.Application.Abstractions.Interfaces.Messaging;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Places.Upload;

public class UploadPlaceCommandHandler
    : ICommandHandler<UploadPlaceCommand>
{
    private readonly IRepository _repository;

    public UploadPlaceCommandHandler(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        UploadPlaceCommand request,
        CancellationToken cancellationToken)
    {
        var category = await _repository
            .AllAsNoTracking<Category>()
            .Include(x => x.Children)
            .FirstOrDefaultAsync(x => x.Id == request.Model.CategoryId, cancellationToken);

        if (category == null)
        {
            var error = new Error("No category with given id was found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        if (category.Children.Any(x => x.Id == request.Model.SubcategoryId) == false)
        {
            var error = new Error("Subcategory in the given category was not found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var country = await _repository.GetByIdAsync<Country>(request.Model.CountryId);

        if (country == null)
        {
            var error = new Error("Country with given id was not found!", ErrorType.Validation);
            return Result.Failure(error);
        }

        var place = new Place
        {
            Name = request.Model.Name,
            Description = request.Model.Description,
            CountryId = request.Model.CountryId,
            CategoryId = request.Model.SubcategoryId,
            UserId = request.Model.UserId,
        };

        await _repository.AddAsync(place);
        await _repository.SaveChangesAsync();

        return Result.Success("Successfully uploaded place!");
    }
}
