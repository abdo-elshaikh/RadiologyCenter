using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
    }

    public class PatientCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(20)]
        public string Phone { get; set; }
        public DateTime? BirthDate { get; set; }
        [MaxLength(10)]
        public string Gender { get; set; }
        [MaxLength(255)]
        public string Address { get; set; }
        [MaxLength(500)]
        public string Notes { get; set; }
    }

    public class PatientUpdateDto : PatientCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
} 