namespace RadiologyCenter.Api.Dto
{
    public class AppointmentPagedFilter
    {
        public int? UnitId { get; set; }
        public int? PatientId { get; set; }
        public string Status { get; set; }
        public string Examination { get; set; }
    }
} 