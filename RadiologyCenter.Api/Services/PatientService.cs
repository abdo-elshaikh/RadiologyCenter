using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Repositories;
using RadiologyCenter.Api.Dto;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System;

namespace RadiologyCenter.Api.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _repository;
        private readonly ICurrentUser _currentUser;
        public PatientService(IPatientRepository repository, ICurrentUser currentUser)
        {
            _repository = repository;
            _currentUser = currentUser;
        }

        private string GetCurrentUsername()
        {
            return _currentUser.UserName ?? "Unknown";
        }

        public async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Patient> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Patient> AddAsync(PatientCreateDto dto)
        {
            var patient = new Patient
            {
                FullName = dto.Name,
                Phone = dto.Phone,
                Gender = dto.Gender,
                BirthDate = dto.BirthDate.Value,
                Address = dto.Address,
                Notes = dto.Notes,
                CreatedBy = GetCurrentUsername(),
                CreatedAt = DateTime.UtcNow
            };
            return await _repository.AddAsync(patient);
        }

        public async Task<Patient> UpdateAsync(int id, PatientUpdateDto dto)
        {
            var patient = await _repository.GetByIdAsync(id);
            if (patient == null) return null;

            patient.FullName = dto.Name;
            patient.Phone = dto.Phone;
            patient.Gender = dto.Gender;
            patient.BirthDate = dto.BirthDate.Value;
            patient.Address = dto.Address;
            patient.Notes = dto.Notes;
            patient.UpdatedBy = GetCurrentUsername();
            patient.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(patient);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<PagedResponse<Patient>> GetPagedAsync(int pageNumber, int pageSize, string nameFilter = null, string phoneFilter = null)
        {
            var (data, totalCount) = await _repository.GetPagedAsync(pageNumber, pageSize, nameFilter, phoneFilter);
            return new PagedResponse<Patient>(data, totalCount, pageNumber, pageSize);
        }
    }
} 