using Explorify.Domain.Abstractions.Models;
using Explorify.Domain.Abstractions.Contracts;
using Explorify.Application.Abstractions.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace Explorify.Persistence;

public class Repository : IRepository, IDisposable
{
    private readonly ExplorifyDbContext _dbContext;

    public Repository(ExplorifyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private DbSet<T> DbSet<T>()
        where T : BaseEntity
            => _dbContext.Set<T>();

    public IQueryable<T> All<T>(bool withDeleted = false)
        where T : BaseEntity
            => withDeleted ?
                DbSet<T>().IgnoreQueryFilters() :
                DbSet<T>();

    public IQueryable<T> AllAsNoTracking<T>(bool withDeleted = false)
        where T : BaseEntity
            => withDeleted ?
                DbSet<T>().AsNoTracking().IgnoreQueryFilters() :
                DbSet<T>().AsNoTracking();

    public async Task AddAsync<T>(T entity)
        where T : BaseEntity
            => await DbSet<T>().AddAsync(entity);

    public async Task<int> SaveChangesAsync()
        => await _dbContext.SaveChangesAsync();

    public async Task<T?> GetByIdAsync<T>(object id)
        where T : BaseEntity
            => await DbSet<T>().FindAsync(id);

    public async Task HardDeleteByIdAsync<T>(object id)
        where T : BaseEntity
    {
        T? entity = await GetByIdAsync<T>(id);

        if (entity != null)
        {
            DbSet<T>().Remove(entity);
        }
    }

    public void HardDelete<T>(T entity) where T : BaseEntity
        => DbSet<T>().Remove(entity);

    public async Task SoftDeleteByIdAsync<T>(object id)
        where T : BaseEntity, IDeletableEntity
    {
        T? entity = await GetByIdAsync<T>(id);

        if (entity != null)
        {
            SoftDelete(entity);
        }
    }

    public void SoftDelete<T>(T entity)
        where T : BaseEntity, IDeletableEntity
    {
        entity.IsDeleted = true;
        entity.DeletedOn = DateTime.UtcNow;
    }

    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _dbContext?.Dispose();
        }
    }
}
