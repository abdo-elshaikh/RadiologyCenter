using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Services
{
    public interface IContractService
    {
        Task<IEnumerable<Contract>> GetAllAsync();
        Task<Contract> GetByIdAsync(int id);
        Task<Contract> AddAsync(Contract contract);
        Task<Contract> UpdateAsync(Contract contract);
        Task<bool> DeleteAsync(int id);
    }
} 