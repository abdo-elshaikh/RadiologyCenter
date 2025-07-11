using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class ExaminationRepository : IExaminationRepository
    {
        private readonly RadiologyCenterContext _context;
        public ExaminationRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Examination>> GetAllAsync()
        {
            return await _context.Examinations.ToListAsync();
        }

        public async Task<Examination> GetByIdAsync(int id)
        {
            return await _context.Examinations.FindAsync(id);
        }

        public async Task<Examination> AddAsync(Examination exam)
        {
            _context.Examinations.Add(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<Examination> UpdateAsync(Examination exam)
        {
            _context.Examinations.Update(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var exam = await _context.Examinations.FindAsync(id);
            if (exam == null) return false;
            _context.Examinations.Remove(exam);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Examination> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, int? appointmentId = null, string examType = null)
        {
            var query = _context.Examinations.AsQueryable();
            if (appointmentId.HasValue)
                query = query.Where(e => e.ExamId == appointmentId);
            if (!string.IsNullOrEmpty(examType))
                query = query.Where(e => e.Unit.Name == examType);
            var totalCount = await query.CountAsync();
            var data = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (data, totalCount);
        }
    }
} 