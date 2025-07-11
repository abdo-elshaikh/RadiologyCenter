using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Repositories;

namespace RadiologyCenter.Api.Services
{
    public class PatientInsuranceService : IPatientInsuranceService
    {
        private readonly IPatientInsuranceRepository _repository;
        public PatientInsuranceService(IPatientInsuranceRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<PatientInsurance>> GetAllAsync() => _repository.GetAllAsync();
        public Task<PatientInsurance> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<PatientInsurance> AddAsync(PatientInsurance entity) => _repository.AddAsync(entity);
        public Task<PatientInsurance> UpdateAsync(PatientInsurance entity) => _repository.UpdateAsync(entity);
        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
        public Task<IEnumerable<PatientInsurance>> GetByPatientIdAsync(int patientId) => _repository.GetByPatientIdAsync(patientId);
    }
} 