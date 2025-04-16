using Explorify.Domain.Abstractions.Models;
using Explorify.Domain.Abstractions.Contracts;

namespace Explorify.Application.Abstractions.Interfaces;

public interface IRepository
{
    IQueryable<T> All<T>(bool withDeleted = false)
        where T : BaseEntity;

    IQueryable<T> AllAsNoTracking<T>(bool withDeleted = false)
        where T : BaseEntity;

    Task AddAsync<T>(T entity)
        where T : BaseEntity;

    Task<T?> GetByIdAsync<T>(object id)
        where T : BaseEntity;

    void HardDelete<T>(T model)
        where T : BaseEntity;

    Task HardDeleteByIdAsync<T>(object id)
        where T : BaseEntity;

    Task SoftDeleteByIdAsync<T>(object id)
        where T : BaseEntity, IDeletableEntity;

    void SoftDelete<T>(T model)
        where T : BaseEntity, IDeletableEntity;

    Task<int> SaveChangesAsync();
}
