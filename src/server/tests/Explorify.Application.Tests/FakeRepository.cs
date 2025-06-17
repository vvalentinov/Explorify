using Explorify.Application.Abstractions.Interfaces;
using Explorify.Domain.Abstractions.Contracts;
using Explorify.Domain.Abstractions.Models;
using Microsoft.EntityFrameworkCore;

namespace Explorify.Application.Tests;

public class FakeRepository : IRepository
{
    private readonly DbContext _context;

    public FakeRepository(DbContext context)
    {
        _context = context;
    }

    public IQueryable<T> All<T>(bool ignoreQueryFilters = false) where T : BaseModel
    {
        return ignoreQueryFilters
            ? _context.Set<T>().IgnoreQueryFilters()
            : _context.Set<T>();
    }

    public IQueryable<T> AllAsNoTracking<T>(bool ignoreQueryFilters = false) where T : BaseModel
    {
        return ignoreQueryFilters
            ? _context.Set<T>().IgnoreQueryFilters().AsNoTracking()
            : _context.Set<T>().AsNoTracking();
    }

    public async Task<T?> GetByIdAsync<T>(object id) where T : BaseModel
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public Task AddAsync<T>(T entity) where T : BaseModel
    {
        _context.Set<T>().Add(entity);
        return Task.CompletedTask;
    }

    public Task AddRangeAsync<T>(IEnumerable<T> entities) where T : BaseModel
    {
        _context.Set<T>().AddRange(entities);
        return Task.CompletedTask;
    }

    public void Update<T>(T entity) where T : BaseModel
    {
        _context.Set<T>().Update(entity);
    }

    public void HardDelete<T>(T model) where T : BaseModel
    {
        _context.Set<T>().Remove(model);
    }

    public async Task HardDeleteByIdAsync<T>(object id) where T : BaseModel
    {
        var entity = await GetByIdAsync<T>(id);
        if (entity != null)
        {
            _context.Set<T>().Remove(entity);
        }
    }

    public void SoftDelete<T>(T model) where T : BaseModel, IDeletableEntity
    {
        model.IsDeleted = true;
        model.DeletedOn = DateTime.UtcNow;
        _context.Set<T>().Update(model);
    }

    public async Task SoftDeleteByIdAsync<T>(object id) where T : BaseModel, IDeletableEntity
    {
        var entity = await GetByIdAsync<T>(id);
        if (entity != null)
        {
            SoftDelete(entity);
        }
    }

    public Task<int> SaveChangesAsync()
    {
        return _context.SaveChangesAsync();
    }
}
