using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RadiologyCenter.Api.Models
{
    public class PatientInsurance
    {
        public int Id { get; set; }
        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
        [Required]
        public int InsuranceProviderId { get; set; }
        [ForeignKey("InsuranceProviderId")]
        public InsuranceProvider InsuranceProvider { get; set; }
        [MaxLength(100)]
        public string PolicyNumber { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
    }
} 