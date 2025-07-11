using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using RadiologyCenter.Api.Dto;
using AutoMapper;
using System.Linq;

namespace RadiologyCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _service;
        private readonly IMapper _mapper;
        public PatientController(IPatientService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            var patients = await _service.GetAllAsync();
            var dtos = patients.Select(_mapper.Map<PatientDto>);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(int id)
        {
            var patient = await _service.GetByIdAsync(id);
            if (patient == null) return NotFound();
            var dto = _mapper.Map<PatientDto>(patient);
            return Ok(dto);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string name = null, [FromQuery] string phone = null)
        {
            var paged = await _service.GetPagedAsync(pageNumber, pageSize, name, phone);
            var dtos = paged.Data.Select(_mapper.Map<PatientDto>);
            return Ok(new { paged.TotalCount, Items = dtos });
        }

        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create([FromBody] PatientCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            var resultDto = _mapper.Map<PatientDto>(created);
            return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<PatientDto>> Update(int id, [FromBody] PatientUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(id, dto);
            var resultDto = _mapper.Map<PatientDto>(updated);
            return Ok(resultDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
} 