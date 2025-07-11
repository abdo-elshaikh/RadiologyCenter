using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class ContractDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Details { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountAmount { get; set; }
    }

    public class ContractCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string Type { get; set; }
        [MaxLength(500)]
        public string Details { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountAmount { get; set; }
    }

    public class ContractUpdateDto : ContractCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 