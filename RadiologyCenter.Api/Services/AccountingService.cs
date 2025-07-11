using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Data;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace RadiologyCenter.Api.Services
{
    public class AccountingService : IAccountingService
    {
        private readonly RadiologyCenterContext _context;
        private readonly IMapper _mapper;
        public AccountingService(RadiologyCenterContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<object>> GetFinancialReportsAsync()
        {
            var payments = await _context.Payments.ToListAsync();
            var totalRevenue = payments.Sum(p => p.Amount);
            var byMethod = payments
                .GroupBy(p => p.Method)
                .Select(g => new { Method = g.Key, Total = g.Sum(p => p.Amount), Count = g.Count() })
                .ToList();

            return new List<object>
            {
                new { Report = "Total Revenue", Value = totalRevenue },
                new { Report = "Payments By Method", Value = byMethod }
            };
        }

        public async Task<IEnumerable<object>> GetPaymentsAsync()
        {
            var payments = await _context.Payments.Include(p => p.Patient).ToListAsync();
            return payments.Select(_mapper.Map<PaymentDto>);
        }

        public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync()
        {
            var payments = await _context.Payments.Include(p => p.Patient).ToListAsync();
            return payments.Select(_mapper.Map<PaymentDto>);
        }

        public async Task<PaymentDto> GetPaymentByIdAsync(int id)
        {
            var payment = await _context.Payments.Include(p => p.Patient).FirstOrDefaultAsync(p => p.Id == id);
            return payment == null ? null : _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> GetPaymentByAppointmentIdAsync(int appointmentId)
        {
            var payment = await _context.Payments.Include(p => p.Patient).FirstOrDefaultAsync(p => p.AppointmentId == appointmentId);
            return payment == null ? null : _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> AddPaymentAsync(PaymentDto dto)
        {
            var payment = _mapper.Map<Payment>(dto);
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            // Reload with patient for mapping
            payment = await _context.Payments.Include(p => p.Patient).FirstOrDefaultAsync(p => p.Id == payment.Id);
            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> UpdatePaymentAsync(int id, PaymentDto dto)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return null;
            _mapper.Map(dto, payment);
            await _context.SaveChangesAsync();
            payment = await _context.Payments.Include(p => p.Patient).FirstOrDefaultAsync(p => p.Id == id);
            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return false;
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 