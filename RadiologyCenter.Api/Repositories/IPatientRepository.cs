using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Repositories
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient> GetByIdAsync(int id);
        Task<Patient> AddAsync(Patient patient);
        Task<Patient> UpdateAsync(Patient patient);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsAsync(int patientId);
        Task<(IEnumerable<Patient> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string nameFilter = null, string phoneFilter = null);
    }
} 