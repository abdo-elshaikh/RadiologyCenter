using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Data;

namespace RadiologyCenter.Api.Models
{
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
        [Required]
        [MaxLength(100)]
        public TransferType TransferType { get; set; }
        [MaxLength(255)]
        public Attachment Attachment { get; set; }
        [MaxLength(100)]
        public string TreatingDoctor { get; set; }
        public string TechnicalId { get; set; }
        public virtual ApplicationUser Technical { get; set; }
        public DateTime ScheduledAt { get; set; }
        [MaxLength(20)]
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public decimal? Discount { get; set; } = 0.0m;
        public string? DiscountReason { get; set; } = string.Empty;
        public string? MedicalNotes { get; set; } = string.Empty;
        public decimal TotalCost { get; set; } = 0.0m;
        public int? InsuranceProviderId { get; set; }
        [ForeignKey("InsuranceProviderId")]
        public InsuranceProvider? InsuranceProvider { get; set; }
        public int? ContractId { get; set; }
        [ForeignKey("ContractId")]
        public Contract? Contract { get; set; }
        public Status Status { get; set; } = Status.Pending;
        public ICollection<AppointmentExamination> AppointmentExaminations { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }

    // status: pending (default), confirmed, cancelled, completed
    // transfer type: emergency, cash (default), urgent, insurance, contract
    // appointment examination: MRI, CT scan, X-ray, ultrasound, Mammogram, PET scan, etc.
    // attachment: direct, without, another, prescription, undefined (default)
    // insurance provider: Aetna, Blue Cross, United Healthcare, etc.
    // contract: contract number, signed date, expiration date, etc.

    public enum Status
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    public enum TransferType
    {
        Emergency,
        Cash,
        Urgent,
        Insurance,
        Contract
    }

    public enum Attachment
    {
        Direct,
        Without,
        Another,
        Prescription,
        Undefined
    }
} 