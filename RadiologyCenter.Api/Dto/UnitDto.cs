using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class UnitDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class UnitCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(255)]
        public string Description { get; set; } = string.Empty;
    }

    public class UnitUpdateDto : UnitCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 