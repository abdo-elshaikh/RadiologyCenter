using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Repositories;
using RadiologyCenter.Api.Exceptions;

namespace RadiologyCenter.Api.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _repository;
        private readonly ICurrentUser _currentUser;
        private readonly IAccountingService _accountingService;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(IAppointmentRepository repository, ICurrentUser currentUser, IAccountingService accountingService, ILogger<AppointmentService> logger)
        {
            _repository = repository;
            _currentUser = currentUser;
            _accountingService = accountingService;
            _logger = logger;
        }

        private string GetCurrentUsername()
        {
            return _currentUser.UserName ?? "Unknown";
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        /// <inheritdoc/>
        public async Task<Appointment> GetByIdAsync(int id)
        {
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with id {AppointmentId} not found.", id);
                throw new AppointmentException("Appointment not found");
            }
            return appointment;
        }

        /// <inheritdoc/>
        public async Task<Appointment> AddAsync(AppointmentCreateDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            if (dto.ExaminationIds == null) dto.ExaminationIds = new List<int>();

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                ScheduledAt = dto.AppointmentDate,
                Status = dto.Status,
                Notes = dto.Notes,
                CreatedBy = GetCurrentUsername(),
                CreatedAt = DateTime.UtcNow,
            };
            // Create examinations
            if (dto.ExaminationIds.Count != 0)
            {
                appointment.AppointmentExaminations = dto.ExaminationIds.Select(eid => new AppointmentExamination { ExaminationId = eid }).ToList();
            }
            return await _repository.AddAsync(appointment);
        }

        /// <inheritdoc/>
        public async Task<Appointment> UpdateAsync(int id, AppointmentUpdateDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with id {AppointmentId} not found for update.", id);
                throw new AppointmentException("Appointment not found");
            }
            var previousStatus = appointment.Status;
            appointment.PatientId = dto.PatientId;
            appointment.ScheduledAt = dto.AppointmentDate;
            appointment.Status = dto.Status;
            appointment.Notes = dto.Notes;
            appointment.UpdatedBy = GetCurrentUsername();
            appointment.UpdatedAt = DateTime.UtcNow;
            // Update examinations
            appointment.AppointmentExaminations = dto.ExaminationIds?.Select(eid => new AppointmentExamination { AppointmentId = appointment.Id, ExaminationId = eid }).ToList();

            var updatedAppointment = await _repository.UpdateAsync(appointment);
            if (previousStatus != updatedAppointment.Status)
            {
                _logger.LogInformation("Appointment with id {AppointmentId} status changed from {PreviousStatus} to {CurrentStatus}.", id, previousStatus, updatedAppointment.Status);
            }
            return updatedAppointment;
        }

        /// <inheritdoc/>
        public async Task<bool> DeleteAsync(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
            {
                _logger.LogWarning("Appointment with id {AppointmentId} not found for deletion.", id);
                throw new AppointmentException("Appointment not found");
            }
            return true;
        }

        /// <inheritdoc/>
        public async Task<PagedResponse<Appointment>> GetPagedAsync
        (int pageNumber, int pageSize, int? unitId = null, int? patientId = null, string status = null, int? examinationId = null)
        {
            var (data, totalCount) = await _repository.GetPagedAsync(pageNumber, pageSize, unitId, patientId, status, examinationId);
            return new PagedResponse<Appointment>(data, totalCount, pageNumber, pageSize);
        }
    }
}