using System.Threading.Tasks;
using System.Collections.Generic;

namespace RadiologyCenter.Api.Services
{
    public interface IAccountingService
    {
        Task<IEnumerable<object>> GetFinancialReportsAsync();
        Task<IEnumerable<object>> GetPaymentsAsync();
        // Advanced Payment operations
        Task<IEnumerable<Dto.PaymentDto>> GetAllPaymentsAsync();
        Task<Dto.PaymentDto> GetPaymentByIdAsync(int id);
        Task<Dto.PaymentDto> GetPaymentByAppointmentIdAsync(int appointmentId);
        Task<Dto.PaymentDto> AddPaymentAsync(Dto.PaymentDto dto);
        Task<Dto.PaymentDto> UpdatePaymentAsync(int id, Dto.PaymentDto dto);
        Task<bool> DeletePaymentAsync(int id);
    }
}