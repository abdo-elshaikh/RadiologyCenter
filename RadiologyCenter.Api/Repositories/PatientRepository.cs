using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly RadiologyCenterContext _context;
        public PatientRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task<Patient> GetByIdAsync(int id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<Patient> AddAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient> UpdateAsync(Patient patient)
        {
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return false;
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Patient> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string nameFilter = null, string phoneFilter = null)
        {
            var query = _context.Patients.AsQueryable();
            if (!string.IsNullOrWhiteSpace(nameFilter))
                query = query.Where(p => p.FullName.Contains(nameFilter));
            if (!string.IsNullOrWhiteSpace(phoneFilter))
                query = query.Where(p => p.Phone.Contains(phoneFilter));
            var totalCount = await query.CountAsync();
            var data = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (data, totalCount);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsAsync(int patientId)
        {
            return await _context.Appointments.Where(a => a.PatientId == patientId).ToListAsync();
        }
    }
} 