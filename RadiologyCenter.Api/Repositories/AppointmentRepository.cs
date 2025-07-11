using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly RadiologyCenterContext _context;
        public AppointmentRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments.Include(a => a.AppointmentExaminations).ToListAsync();
        }

        public async Task<Appointment> GetByIdAsync(int id)
        {
            return await _context.Appointments.Include(a => a.AppointmentExaminations).FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Appointment> AddAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> UpdateAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Appointment> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, int? unitId = null, int? patientId = null, string status = null, int? examinationId = null)
        {
            var query = _context.Appointments.Include(a => a.AppointmentExaminations).AsQueryable();
            
            if (patientId.HasValue)
                query = query.Where(a => a.PatientId == patientId);
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(a => a.Status.ToString() == status);
            if (examinationId.HasValue)
                query = query.Where(a => a.AppointmentExaminations.Any(ae => ae.ExaminationId == examinationId.Value));
            var totalCount = await query.CountAsync();
            var data = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (data, totalCount);
        }
    }
} 