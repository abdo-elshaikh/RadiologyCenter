using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class PatientInsuranceRepository : IPatientInsuranceRepository
    {
        private readonly RadiologyCenterContext _context;
        public PatientInsuranceRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientInsurance>> GetAllAsync()
        {
            return await _context.PatientInsurances.Include(pi => pi.InsuranceProvider).ToListAsync();
        }

        public async Task<PatientInsurance> GetByIdAsync(int id)
        {
            return await _context.PatientInsurances.Include(pi => pi.InsuranceProvider).FirstOrDefaultAsync(pi => pi.Id == id);
        }

        public async Task<PatientInsurance> AddAsync(PatientInsurance entity)
        {
            _context.PatientInsurances.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<PatientInsurance> UpdateAsync(PatientInsurance entity)
        {
            _context.PatientInsurances.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.PatientInsurances.FindAsync(id);
            if (entity == null) return false;
            _context.PatientInsurances.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PatientInsurance>> GetByPatientIdAsync(int patientId)
        {
            return await _context.PatientInsurances.Include(pi => pi.InsuranceProvider).Where(pi => pi.PatientId == patientId).ToListAsync();
        }
    }
} 