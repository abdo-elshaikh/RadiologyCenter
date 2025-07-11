using System;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class AppointmentUpdateDto : AppointmentCreateDto
    {
        [Required]
        public int Id { get; set; }
    }
}