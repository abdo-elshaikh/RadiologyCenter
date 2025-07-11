using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Services;
using System.Threading.Tasks;
using RadiologyCenter.Api.Dto;
using AutoMapper;
using System.Linq;

namespace RadiologyCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientInsuranceController : ControllerBase
    {
        private readonly IPatientInsuranceService _service;
        private readonly IMapper _mapper;
        public PatientInsuranceController(IPatientInsuranceService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var dtos = entities.Select(_mapper.Map<PatientInsuranceDto>);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();
            var dto = _mapper.Map<PatientInsuranceDto>(entity);
            return Ok(dto);
        }

        [HttpGet("by-patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(int patientId)
        {
            var entities = await _service.GetByPatientIdAsync(patientId);
            var dtos = entities.Select(_mapper.Map<PatientInsuranceDto>);
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PatientInsuranceCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var entity = _mapper.Map<PatientInsurance>(dto);
            var created = await _service.AddAsync(entity);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PatientInsuranceUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != dto.Id) return BadRequest();
            var entity = _mapper.Map<PatientInsurance>(dto);
            var updated = await _service.UpdateAsync(entity);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
} 