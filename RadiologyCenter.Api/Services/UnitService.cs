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
    public class UnitService : IUnitService
    {
        private readonly IUnitRepository _repository;
        private readonly ICurrentUser _currentUser;
        public UnitService(IUnitRepository repository, ICurrentUser currentUser)
        {
            _repository = repository;
            _currentUser = currentUser;
        }

        private string GetCurrentUsername()
        {
            return _currentUser.UserName ?? "Unknown";
        }

        public async Task<IEnumerable<Unit>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Unit> GetByIdAsync(int id)
        {
            var unit = await _repository.GetByIdAsync(id);
            if (unit == null)
                throw new UnitException("Unit not found");
            return unit;
        }

        public async Task<Unit> AddAsync(UnitCreateDto dto)
        {
            var unit = new Unit
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedBy = GetCurrentUsername(),
                CreatedAt = DateTime.UtcNow
            };
            return await _repository.AddAsync(unit);
        }

        public async Task<Unit> UpdateAsync(int id, UnitUpdateDto dto)
        {
            var unit = await _repository.GetByIdAsync(id);
            if (unit == null)
                throw new UnitException("Unit not found");
            unit.Name = dto.Name;
            unit.Description = dto.Description;
            unit.UpdatedBy = GetCurrentUsername();
            unit.UpdatedAt = DateTime.UtcNow;
            return await _repository.UpdateAsync(unit);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                throw new UnitException("Unit not found");
            return true;
        }

        public async Task<PagedResponse<Unit>> GetPagedAsync(int pageNumber, int pageSize, string name = null)
        {
            var (data, totalCount) = await _repository.GetPagedAsync(pageNumber, pageSize, name);
            return new PagedResponse<Unit>(data, totalCount, pageNumber, pageSize);
        }
    }
} 