using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Repositories
{
    public interface IUnitRepository
    {
        Task<IEnumerable<Unit>> GetAllAsync();
        Task<Unit> GetByIdAsync(int id);
        Task<Unit> AddAsync(Unit unit);
        Task<Unit> UpdateAsync(Unit unit);
        Task<bool> DeleteAsync(int id);
        Task<(IEnumerable<Unit> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string name = null);
    }
} 