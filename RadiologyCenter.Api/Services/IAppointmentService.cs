using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;

namespace RadiologyCenter.Api.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment> GetByIdAsync(int id);
        Task<Appointment> AddAsync(AppointmentCreateDto dto);
        Task<Appointment> UpdateAsync(int id, AppointmentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResponse<Appointment>> GetPagedAsync(int pageNumber, int pageSize, int? unitId = null, int? patientId = null, string status = null, int? examinationId = null);
    }
} 