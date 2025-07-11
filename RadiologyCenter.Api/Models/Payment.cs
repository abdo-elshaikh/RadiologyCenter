using System;

namespace RadiologyCenter.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Method { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public int? PatientId { get; set; }
        public Patient Patient { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public string Notes { get; set; }
    }
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Refunded
} 