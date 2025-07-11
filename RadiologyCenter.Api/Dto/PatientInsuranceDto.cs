using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class PatientInsuranceDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int InsuranceProviderId { get; set; }
        public string PolicyNumber { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }

    public class PatientInsuranceCreateDto
    {
        [Required]
        public int PatientId { get; set; }
        [Required]
        public int InsuranceProviderId { get; set; }
        [MaxLength(100)]
        public string PolicyNumber { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }

    public class PatientInsuranceUpdateDto : PatientInsuranceCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 