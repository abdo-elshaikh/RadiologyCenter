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
    public class ExaminationController : ControllerBase
    {
        private readonly IExaminationService _service;
        private readonly IMapper _mapper;
        public ExaminationController(IExaminationService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExaminationDto>>> GetAll()
        {
            var exams = await _service.GetAllAsync();
            var dtos = exams.Select(_mapper.Map<ExaminationDto>);
            return Ok(dtos);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<ExaminationDto>>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] int? appointmentId = null, [FromQuery] string examType = null)
        {
            var paged = await _service.GetPagedAsync(pageNumber, pageSize, appointmentId, examType);
            var dtos = paged.Data.Select(_mapper.Map<ExaminationDto>);
            return Ok(new { paged.TotalCount, Items = dtos });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExaminationDto>> GetById(int id)
        {
            try
            {
                var exam = await _service.GetByIdAsync(id);
                var dto = _mapper.Map<ExaminationDto>(exam);
                return Ok(dto);
            }
            catch (ExaminationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ExaminationDto>>> GetAllExaminations()
        {
            var exams = await _service.GetAllAsync();
            var dtos = exams.Select(_mapper.Map<ExaminationDto>);
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<ExaminationDto>> Create([FromBody] ExaminationCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            var resultDto = _mapper.Map<ExaminationDto>(created);
            return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<ExaminationDto>> Update(int id, [FromBody] ExaminationUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                var resultDto = _mapper.Map<ExaminationDto>(updated);
                return Ok(resultDto);
            }
            catch (ExaminationException ex)
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
            catch (ExaminationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 