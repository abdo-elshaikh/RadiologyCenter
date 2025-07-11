using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class InsuranceProviderDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ContactInfo { get; set; }
        public string PolicyDetails { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountAmount { get; set; }
    }

    public class InsuranceProviderCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(255)]
        public string ContactInfo { get; set; }
        [MaxLength(500)]
        public string PolicyDetails { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountAmount { get; set; }
    }

    public class InsuranceProviderUpdateDto : InsuranceProviderCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 