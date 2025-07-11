using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Repositories;

namespace RadiologyCenter.Api.Services
{
    public class PatientContractService : IPatientContractService
    {
        private readonly IPatientContractRepository _repository;
        public PatientContractService(IPatientContractRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<PatientContract>> GetAllAsync() => _repository.GetAllAsync();
        public Task<PatientContract> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<PatientContract> AddAsync(PatientContract entity) => _repository.AddAsync(entity);
        public Task<PatientContract> UpdateAsync(PatientContract entity) => _repository.UpdateAsync(entity);
        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
        public Task<IEnumerable<PatientContract>> GetByPatientIdAsync(int patientId) => _repository.GetByPatientIdAsync(patientId);
    }
} 