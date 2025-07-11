using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Services;
using RadiologyCenter.Api.Exceptions;
using AutoMapper;
using System.Linq;

namespace RadiologyCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _service;
        private readonly IMapper _mapper;
        public AppointmentController(IAppointmentService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var appointments = await _service.GetAllAsync();
            var dtos = appointments.Select(_mapper.Map<AppointmentDto>);
            return Ok(dtos);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] int? unitId = null, [FromQuery] int? patientId = null, [FromQuery] string status = null, [FromQuery] int? examinationId = null)
        {
            var paged = await _service.GetPagedAsync(pageNumber, pageSize, unitId, patientId, status, examinationId);
            var dtos = paged.Data.Select(_mapper.Map<AppointmentDto>);
            return Ok(new { paged.TotalCount, Items = dtos });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetById(int id)
        {
            try
            {
                var appointment = await _service.GetByIdAsync(id);
                var dto = _mapper.Map<AppointmentDto>(appointment);
                return Ok(dto);
            }
            catch (AppointmentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Create([FromBody] AppointmentCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            var resultDto = _mapper.Map<AppointmentDto>(created);
            return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Update(int id, [FromBody] AppointmentUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                var resultDto = _mapper.Map<AppointmentDto>(updated);
                return Ok(resultDto);
            }
            catch (AppointmentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (AppointmentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 