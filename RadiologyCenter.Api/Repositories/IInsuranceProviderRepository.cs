using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Repositories
{
    public interface IInsuranceProviderRepository
    {
        Task<IEnumerable<InsuranceProvider>> GetAllAsync();
        Task<InsuranceProvider> GetByIdAsync(int id);
        Task<InsuranceProvider> AddAsync(InsuranceProvider provider);
        Task<InsuranceProvider> UpdateAsync(InsuranceProvider provider);
        Task<bool> DeleteAsync(int id);
    }
} 