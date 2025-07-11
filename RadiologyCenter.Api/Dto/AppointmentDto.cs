using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RadiologyCenter.Api.Dto
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int UnitId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public string Examination { get; set; }
        public int? InsuranceProviderId { get; set; }
        public int? ContractId { get; set; }
        public string Notes { get; set; }
        public List<int> ExaminationIds { get; set; }
        public List<ExaminationDto> Examinations { get; set; }
    }
}
