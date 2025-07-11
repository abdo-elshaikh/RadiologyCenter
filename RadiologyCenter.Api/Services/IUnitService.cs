using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;

namespace RadiologyCenter.Api.Services
{
    public interface IUnitService
    {
        Task<IEnumerable<Unit>> GetAllAsync();
        Task<Unit> GetByIdAsync(int id);
        Task<Unit> AddAsync(UnitCreateDto dto);
        Task<Unit> UpdateAsync(int id, UnitUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResponse<Unit>> GetPagedAsync(int pageNumber, int pageSize, string name = null);
    }
} 