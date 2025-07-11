using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Models
{
    public class AppointmentExamination
    {
        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

        public int ExaminationId { get; set; }
        [ForeignKey("ExaminationId")]
        public Examination Examination { get; set; }
    }
} 