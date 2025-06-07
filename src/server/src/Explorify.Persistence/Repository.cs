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
        where T : BaseModel
            => _dbContext.Set<T>();

    public IQueryable<T> All<T>(bool ignoreQueryFilters = false)
        where T : BaseModel
            => ignoreQueryFilters ?
                DbSet<T>().IgnoreQueryFilters() :
                DbSet<T>();

    public IQueryable<T> AllAsNoTracking<T>(bool ignoreQueryFilters = false)
        where T : BaseModel
            => ignoreQueryFilters ?
                DbSet<T>().AsNoTracking().IgnoreQueryFilters() :
                DbSet<T>().AsNoTracking();

    public async Task AddAsync<T>(T entity)
        where T : BaseModel
            => await DbSet<T>().AddAsync(entity);

    public async Task AddRangeAsync<T>(IEnumerable<T> entities)
        where T : BaseModel
            => await DbSet<T>().AddRangeAsync(entities);

    public async Task<int> SaveChangesAsync()
        => await _dbContext.SaveChangesAsync();

    public async Task<T?> GetByIdAsync<T>(object id)
        where T : BaseModel
            => await DbSet<T>().FindAsync(id);

    public async Task HardDeleteByIdAsync<T>(object id)
        where T : BaseModel
    {
        T? entity = await GetByIdAsync<T>(id);

        if (entity != null)
        {
            DbSet<T>().Remove(entity);
        }
    }

    public void HardDelete<T>(T entity) where T : BaseModel
        => DbSet<T>().Remove(entity);

    public async Task SoftDeleteByIdAsync<T>(object id)
        where T : BaseModel, IDeletableEntity
    {
        T? entity = await GetByIdAsync<T>(id);

        if (entity != null)
        {
            SoftDelete(entity);
        }
    }

    public virtual void Update<T>(T entity)
        where T : BaseModel
    {
        var entry = _dbContext.Entry(entity);

        if (entry.State == EntityState.Detached)
        {
            DbSet<T>().Attach(entity);
        }

        entry.State = EntityState.Modified;
    }

    public void SoftDelete<T>(T entity)
        where T : BaseModel, IDeletableEntity
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
