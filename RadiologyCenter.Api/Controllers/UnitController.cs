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
    public class UnitController : ControllerBase
    {
        private readonly IUnitService _service;
        private readonly IMapper _mapper;
        public UnitController(IUnitService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnitDto>>> GetAll()
        {
            var units = await _service.GetAllAsync();
            var dtos = units.Select(_mapper.Map<UnitDto>);
            return Ok(dtos);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<UnitDto>>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string name = null)
        {
            var paged = await _service.GetPagedAsync(pageNumber, pageSize, name);
            var dtos = paged.Data.Select(_mapper.Map<UnitDto>);
            return Ok(new { paged.TotalCount, Items = dtos });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UnitDto>> GetById(int id)
        {
            try
            {
                var unit = await _service.GetByIdAsync(id);
                var dto = _mapper.Map<UnitDto>(unit);
                return Ok(dto);
            }
            catch (UnitException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UnitDto>> Create([FromBody] UnitCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(dto);
            var resultDto = _mapper.Map<UnitDto>(created);
            return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UnitDto>> Update(int id, [FromBody] UnitUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                var resultDto = _mapper.Map<UnitDto>(updated);
                return Ok(resultDto);
            }
            catch (UnitException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (UnitException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 