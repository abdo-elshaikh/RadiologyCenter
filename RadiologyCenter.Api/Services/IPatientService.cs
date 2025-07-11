using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;

namespace RadiologyCenter.Api.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient> GetByIdAsync(int id);
        Task<Patient> AddAsync(PatientCreateDto patient);
        Task<Patient> UpdateAsync(int id, PatientUpdateDto patient);
        Task<bool> DeleteAsync(int id);
        Task<PagedResponse<Patient>> GetPagedAsync(int pageNumber, int pageSize, string nameFilter = null, string phoneFilter = null);
    }
} 