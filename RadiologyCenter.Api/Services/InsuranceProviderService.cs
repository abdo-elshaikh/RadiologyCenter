using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Repositories;

namespace RadiologyCenter.Api.Services
{
    public class InsuranceProviderService : IInsuranceProviderService
    {
        private readonly IInsuranceProviderRepository _repository;
        public InsuranceProviderService(IInsuranceProviderRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<InsuranceProvider>> GetAllAsync() => _repository.GetAllAsync();
        public Task<InsuranceProvider> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<InsuranceProvider> AddAsync(InsuranceProvider provider) => _repository.AddAsync(provider);
        public Task<InsuranceProvider> UpdateAsync(InsuranceProvider provider) => _repository.UpdateAsync(provider);
        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
} 