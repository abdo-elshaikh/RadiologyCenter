using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;

namespace RadiologyCenter.Api.Services
{
    public interface IExaminationService
    {
        Task<IEnumerable<Examination>> GetAllAsync();
        Task<Examination> GetByIdAsync(int id);
        Task<Examination> AddAsync(ExaminationCreateDto dto);
        Task<Examination> UpdateAsync(int id, ExaminationUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResponse<Examination>> GetPagedAsync(int pageNumber, int pageSize, int? appointmentId = null, string examType = null);
    }
} 