using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RadiologyCenter.Api.Services;
using System.Threading.Tasks;

namespace RadiologyCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Accountant")]
    public class AccountingController : ControllerBase
    {
        private readonly IAccountingService _accountingService;
        public AccountingController(IAccountingService accountingService)
        {
            _accountingService = accountingService;
        }

        [HttpGet("reports")]
        public async Task<IActionResult> GetFinancialReports()
        {
            var reports = await _accountingService.GetFinancialReportsAsync();
            return Ok(reports);
        }

        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments()
        {
            var payments = await _accountingService.GetPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("payments/all")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _accountingService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("payments/{id}")]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var payment = await _accountingService.GetPaymentByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [HttpPost("payments")]
        public async Task<IActionResult> AddPayment([FromBody] RadiologyCenter.Api.Dto.PaymentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _accountingService.AddPaymentAsync(dto);
            return CreatedAtAction(nameof(GetPaymentById), new { id = created.Id }, created);
        }

        [HttpPut("payments/{id}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] RadiologyCenter.Api.Dto.PaymentDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _accountingService.UpdatePaymentAsync(id, dto);
            return Ok(updated);
        }

        [HttpDelete("payments/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var deleted = await _accountingService.DeletePaymentAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
} 