using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Repositories;

namespace RadiologyCenter.Api.Services
{
    public class ContractService : IContractService
    {
        private readonly IContractRepository _repository;
        public ContractService(IContractRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Contract>> GetAllAsync() => _repository.GetAllAsync();
        public Task<Contract> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<Contract> AddAsync(Contract contract) => _repository.AddAsync(contract);
        public Task<Contract> UpdateAsync(Contract contract) => _repository.UpdateAsync(contract);
        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
} 