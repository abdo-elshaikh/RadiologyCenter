using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Models
{
    public class InsuranceProvider
    {
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(255)]
        public string ContactInfo { get; set; }
        [MaxLength(500)]
        public string PolicyDetails { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
    }
}