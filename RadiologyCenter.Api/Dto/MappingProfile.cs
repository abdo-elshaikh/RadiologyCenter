using AutoMapper;
using RadiologyCenter.Api.Models;
using System.Linq;

namespace RadiologyCenter.Api.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // InsuranceProvider
            CreateMap<InsuranceProvider, InsuranceProviderDto>();
            CreateMap<InsuranceProviderCreateDto, InsuranceProvider>();
            CreateMap<InsuranceProviderUpdateDto, InsuranceProvider>();

            // Contract
            CreateMap<Contract, ContractDto>();
            CreateMap<ContractCreateDto, Contract>();
            CreateMap<ContractUpdateDto, Contract>();

            // PatientInsurance
            CreateMap<PatientInsurance, PatientInsuranceDto>();
            CreateMap<PatientInsuranceCreateDto, PatientInsurance>();
            CreateMap<PatientInsuranceUpdateDto, PatientInsurance>();

            // PatientContract
            CreateMap<PatientContract, PatientContractDto>();
            CreateMap<PatientContractCreateDto, PatientContract>();
            CreateMap<PatientContractUpdateDto, PatientContract>();

            // Patient
            CreateMap<Patient, PatientDto>();
            CreateMap<PatientCreateDto, Patient>();
            CreateMap<PatientUpdateDto, Patient>();

            // Unit
            CreateMap<Unit, UnitDto>();
            CreateMap<UnitCreateDto, Unit>();
            CreateMap<UnitUpdateDto, Unit>();

            // Examination
            CreateMap<Examination, ExaminationDto>();
            CreateMap<ExaminationCreateDto, Examination>();
            CreateMap<ExaminationUpdateDto, Examination>();

            // Appointment
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.Examinations, opt => opt.MapFrom(src => src.AppointmentExaminations.Select(ae => ae.Examination)));
            CreateMap<AppointmentCreateDto, Appointment>();
            CreateMap<AppointmentUpdateDto, Appointment>();

            CreateMap<Models.Payment, PaymentDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient != null ? src.Patient.FullName : null))
                .ForMember(dest => dest.AppointmentId, opt => opt.MapFrom(src => src.AppointmentId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
            CreateMap<PaymentDto, Models.Payment>()
                .ForMember(dest => dest.AppointmentId, opt => opt.MapFrom(src => src.AppointmentId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse(typeof(PaymentStatus), src.Status)));
        }
    }
} 