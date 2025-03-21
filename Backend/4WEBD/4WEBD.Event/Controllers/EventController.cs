using _4WEBD.Event.Data;
using _4WEBD.Event.Dtos.EventDto;
using _4WEBD.Event.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace _4WEBD.Event.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController(EventContext context, IConfiguration configuration) : ControllerBase
    {
        #region Properties

        private readonly EventContext _context;
        private readonly IConfiguration _configuration;


        #endregion
        

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    
    public async Task<IActionResult> Create([FromBody] AddEventDto eventDto)
    {
        var eventModel = new EventModel
        {
            Title = eventDto.Title,
            Description = eventDto.Description,
            Date = eventDto.Date,
            Location = eventDto.Location,
        };
        await _context.AddAsync(eventModel);
        await _context.SaveChangesAsync();

        return Ok(new EventDto(eventModel));
    }
    
    /// <summary>
    /// Permet de recuperer un evenement
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    
    [HttpGet]
    [Route("get/{id}")]
    [AllowAnonymous]
    
    public async Task<IActionResult> Get(Guid id)
    {
        var eventModel = await _context.FindAsync<EventModel>(id);
        if (eventModel == null)
        {
            return NotFound();
        }
        return Ok(new EventDto(eventModel));
    }
    }
}
