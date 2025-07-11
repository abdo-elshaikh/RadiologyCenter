using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Repositories;
using RadiologyCenter.Api.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System;
namespace RadiologyCenter.Api.Services
{
    public class ExaminationService : IExaminationService
    {
        private readonly IExaminationRepository _repository;
        private readonly ICurrentUser _currentUser;
        private readonly IAppointmentService _appointmentService;
        private readonly IInsuranceProviderService _insuranceProviderService;
        private readonly IContractService _contractService;
        public ExaminationService(
            IExaminationRepository repository,
            ICurrentUser currentUser,
            IAppointmentService appointmentService,
            IInsuranceProviderService insuranceProviderService,
            IContractService contractService)
        {
            _repository = repository;
            _currentUser = currentUser;
            _appointmentService = appointmentService;
            _insuranceProviderService = insuranceProviderService;
            _contractService = contractService;
        }

        private string GetCurrentUsername()
        {
            return _currentUser.UserName ?? "Unknown";
        }

        public async Task<IEnumerable<Examination>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Examination> GetByIdAsync(int id)
        {
            var exam = await _repository.GetByIdAsync(id);
            if (exam == null)
                throw new ExaminationException("Examination not found");
            return exam;
        }

        public async Task<Examination> AddAsync(ExaminationCreateDto dto)
        {
            var exam = new Examination
            {
                ExamNameEn = dto.ExamNameEn,
                ExamNameAr = dto.ExamNameAr,
                BasePrice = dto.BasePrice,
                UnitId = dto.UnitId,
                CreatedBy = GetCurrentUsername(),
                CreatedAt = DateTime.UtcNow
            };
            return await _repository.AddAsync(exam);
        }

        public async Task<Examination> UpdateAsync(int id, ExaminationUpdateDto dto)
        {
            var exam = await _repository.GetByIdAsync(id);
            if (exam == null)
                throw new ExaminationException("Examination not found");

            exam.ExamNameEn = dto.ExamNameEn;
            exam.ExamNameAr = dto.ExamNameAr;
            exam.BasePrice = dto.BasePrice;
            exam.UnitId = dto.UnitId;
            exam.UpdatedBy = GetCurrentUsername();
            exam.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(exam);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                throw new ExaminationException("Examination not found");
            return true;
        }

        public async Task<PagedResponse<Examination>> GetPagedAsync(int pageNumber, int pageSize, int? appointmentId = null, string examType = null)
        {
            var (data, totalCount) = await _repository.GetPagedAsync(pageNumber, pageSize, appointmentId, examType);
            return new PagedResponse<Examination>(data, totalCount, pageNumber, pageSize);
        }
    }
} 