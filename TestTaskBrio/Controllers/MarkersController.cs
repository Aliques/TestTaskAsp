using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTaskBrio.Domain.Core;
using TestTaskBrio.Domain.Interfaces;

namespace TestTaskBrio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MarkersController : ControllerBase
    {
        private readonly IMarkerRepository _markerRepository;

        public MarkersController(IMarkerRepository markerRepository)
        {
            _markerRepository = markerRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Marker>> Get()
        {
            return  await _markerRepository.FindAllAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Marker marker)
        {
            var result = _markerRepository.CreateMarker(marker);
            await _markerRepository.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<int> Delete([FromBody]Marker marker)
        {
            var id =  _markerRepository.Delete(marker);
            await _markerRepository.SaveChangesAsync();

            return id;
        }

        [HttpDelete("/all")]
        public async Task<IActionResult> DeleteAll()
        {
            var result = await _markerRepository.RemoveAll();

            return Ok();
        }
    }
}
