using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Models
{
    public class Contract
    {
        public int Id { get; set; }
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
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
    }
} 