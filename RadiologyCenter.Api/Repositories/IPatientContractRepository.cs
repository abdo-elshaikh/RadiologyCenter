using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Repositories
{
    public interface IPatientContractRepository
    {
        Task<IEnumerable<PatientContract>> GetAllAsync();
        Task<PatientContract> GetByIdAsync(int id);
        Task<PatientContract> AddAsync(PatientContract entity);
        Task<PatientContract> UpdateAsync(PatientContract entity);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<PatientContract>> GetByPatientIdAsync(int patientId);
    }
} 