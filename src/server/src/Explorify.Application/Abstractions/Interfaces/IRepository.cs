using Explorify.Domain.Abstractions.Models;
using Explorify.Domain.Abstractions.Contracts;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IRepository
{
    IQueryable<T> All<T>(bool ignoreQueryFilters = false)
        where T : BaseModel;

    IQueryable<T> AllAsNoTracking<T>(bool ignoreQueryFilters = false)
        where T : BaseModel;

    Task AddAsync<T>(T entity)
        where T : BaseModel;

    Task AddRangeAsync<T>(IEnumerable<T> entities)
        where T : BaseModel;

    Task<T?> GetByIdAsync<T>(object id)
        where T : BaseModel;

    void HardDelete<T>(T model)
        where T : BaseModel;

    void Update<T>(T entity)
        where T : BaseModel;

    Task HardDeleteByIdAsync<T>(object id)
        where T : BaseModel;

    Task SoftDeleteByIdAsync<T>(object id)
        where T : BaseModel, IDeletableEntity;

    void SoftDelete<T>(T model)
        where T : BaseModel, IDeletableEntity;

    Task<int> SaveChangesAsync();
}
