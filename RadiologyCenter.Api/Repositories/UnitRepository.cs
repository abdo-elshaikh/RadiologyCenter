using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class UnitRepository : IUnitRepository
    {
        private readonly RadiologyCenterContext _context;
        public UnitRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Unit>> GetAllAsync()
        {
            return await _context.Units.ToListAsync();
        }

        public async Task<Unit> GetByIdAsync(int id)
        {
            return await _context.Units.FindAsync(id);
        }

        public async Task<Unit> AddAsync(Unit unit)
        {
            _context.Units.Add(unit);
            await _context.SaveChangesAsync();
            return unit;
        }

        public async Task<Unit> UpdateAsync(Unit unit)
        {
            _context.Units.Update(unit);
            await _context.SaveChangesAsync();
            return unit;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return false;
            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(IEnumerable<Unit> Data, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string name = null)
        {
            var query = _context.Units.AsQueryable();
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(u => u.Name.Contains(name));
            var totalCount = await query.CountAsync();
            var data = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return (data, totalCount);
        }
    }
} 