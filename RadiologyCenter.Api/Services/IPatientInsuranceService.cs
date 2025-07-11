using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Services
{
    public interface IPatientInsuranceService
    {
        Task<IEnumerable<PatientInsurance>> GetAllAsync();
        Task<PatientInsurance> GetByIdAsync(int id);
        Task<PatientInsurance> AddAsync(PatientInsurance entity);
        Task<PatientInsurance> UpdateAsync(PatientInsurance entity);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<PatientInsurance>> GetByPatientIdAsync(int patientId);
    }
} 