using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class PatientContractDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int ContractId { get; set; }
        public string ContractNumber { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }

    public class PatientContractCreateDto
    {
        [Required]
        public int PatientId { get; set; }
        [Required]
        public int ContractId { get; set; }
        [MaxLength(100)]
        public string ContractNumber { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
    }

    public class PatientContractUpdateDto : PatientContractCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 