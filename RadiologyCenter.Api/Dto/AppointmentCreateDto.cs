using System;
using System.ComponentModel.DataAnnotations;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Dto
{
    public class AppointmentCreateDto
    {
        [Required]
        public int PatientId { get; set; }
        [Required]
        public int UnitId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Examination { get; set; }
        [MaxLength(100)]
        public string TransferType { get; set; }
        [MaxLength(255)]
        public string Attachment { get; set; }
        [MaxLength(100)]
        public string TreatingDoctor { get; set; }
        [MaxLength(100)]
        public string Technical { get; set; }
        [Required]
        public DateTime ScheduledAt { get; set; }
        [MaxLength(20)]
        public Status Status { get; set; }
        [MaxLength(255)]
        public string Notes { get; set; }
        public decimal? Discount { get; set; } = 0.0m;
        [MaxLength(255)]
        public string DiscountReason { get; set; } = string.Empty;
        [MaxLength(255)]
        public string MedicalNotes { get; set; } = string.Empty;
        public decimal TotalCost { get; set; } = 0.0m;
        public int? InsuranceProviderId { get; set; }
        public int? ContractId { get; set; }
        public List<int> ExaminationIds { get; set; }
        public DateTime AppointmentDate { get; set; } = DateTime.UtcNow;
    }
} 