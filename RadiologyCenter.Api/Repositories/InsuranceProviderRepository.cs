using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class InsuranceProviderRepository : IInsuranceProviderRepository
    {
        private readonly RadiologyCenterContext _context;
        public InsuranceProviderRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InsuranceProvider>> GetAllAsync()
        {
            return await _context.InsuranceProviders.ToListAsync();
        }

        public async Task<InsuranceProvider> GetByIdAsync(int id)
        {
            return await _context.InsuranceProviders.FindAsync(id);
        }

        public async Task<InsuranceProvider> AddAsync(InsuranceProvider provider)
        {
            _context.InsuranceProviders.Add(provider);
            await _context.SaveChangesAsync();
            return provider;
        }

        public async Task<InsuranceProvider> UpdateAsync(InsuranceProvider provider)
        {
            _context.InsuranceProviders.Update(provider);
            await _context.SaveChangesAsync();
            return provider;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var provider = await _context.InsuranceProviders.FindAsync(id);
            if (provider == null) return false;
            _context.InsuranceProviders.Remove(provider);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 