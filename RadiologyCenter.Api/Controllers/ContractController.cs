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
    public class ContractController : ControllerBase
    {
        private readonly IContractService _service;
        private readonly IMapper _mapper;
        public ContractController(IContractService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var dtos = entities.Select(_mapper.Map<ContractDto>);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();
            var dto = _mapper.Map<ContractDto>(entity);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ContractCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var contract = _mapper.Map<Contract>(dto);
            var created = await _service.AddAsync(contract);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContractUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != dto.Id) return BadRequest();
            var contract = _mapper.Map<Contract>(dto);
            var updated = await _service.UpdateAsync(contract);
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