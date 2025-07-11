using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Repositories
{
    public interface IExaminationRepository
    {
        Task<IEnumerable<Examination>> GetAllAsync();
        Task<Examination> GetByIdAsync(int id);
        Task<Examination> AddAsync(Examination exam);
        Task<Examination> UpdateAsync(Examination exam);
        Task<bool> DeleteAsync(int id);
        Task<(IEnumerable<Examination> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, int? appointmentId = null, string examType = null);
    }
} 