using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class PatientContractRepository : IPatientContractRepository
    {
        private readonly RadiologyCenterContext _context;
        public PatientContractRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientContract>> GetAllAsync()
        {
            return await _context.PatientContracts.Include(pc => pc.Contract).ToListAsync();
        }

        public async Task<PatientContract> GetByIdAsync(int id)
        {
            return await _context.PatientContracts.Include(pc => pc.Contract).FirstOrDefaultAsync(pc => pc.Id == id);
        }

        public async Task<PatientContract> AddAsync(PatientContract entity)
        {
            _context.PatientContracts.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<PatientContract> UpdateAsync(PatientContract entity)
        {
            _context.PatientContracts.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.PatientContracts.FindAsync(id);
            if (entity == null) return false;
            _context.PatientContracts.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PatientContract>> GetByPatientIdAsync(int patientId)
        {
            return await _context.PatientContracts.Include(pc => pc.Contract).Where(pc => pc.PatientId == patientId).ToListAsync();
        }
    }
} 