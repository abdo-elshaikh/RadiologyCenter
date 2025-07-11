using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class ExaminationDto
    {
        public int Id { get; set; }
        public string ExamNameEn { get; set; }
        public string ExamNameAr { get; set; }
        public decimal BasePrice { get; set; }
        public int UnitId { get; set; }
    }

    public class ExaminationCreateDto
    {
        [Required, MaxLength(100)]
        public string ExamNameEn { get; set; }
        [Required, MaxLength(100)]
        public string ExamNameAr { get; set; }
        [Required]
        public int UnitId { get; set; }
        public decimal BasePrice { get; set; }
    }

    public class ExaminationUpdateDto : ExaminationCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 