using System;

namespace RadiologyCenter.Api.Dto
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Method { get; set; }
        public int? PatientId { get; set; }
        public string PatientName { get; set; }
        public string Notes { get; set; }
        public int AppointmentId { get; set; }
        public string Status { get; set; }
    }
} 