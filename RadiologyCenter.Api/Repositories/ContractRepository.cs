using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;

namespace RadiologyCenter.Api.Repositories
{
    public class ContractRepository : IContractRepository
    {
        private readonly RadiologyCenterContext _context;
        public ContractRepository(RadiologyCenterContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Contract>> GetAllAsync()
        {
            return await _context.Contracts.ToListAsync();
        }

        public async Task<Contract> GetByIdAsync(int id)
        {
            return await _context.Contracts.FindAsync(id);
        }

        public async Task<Contract> AddAsync(Contract contract)
        {
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();
            return contract;
        }

        public async Task<Contract> UpdateAsync(Contract contract)
        {
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();
            return contract;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return false;
            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 