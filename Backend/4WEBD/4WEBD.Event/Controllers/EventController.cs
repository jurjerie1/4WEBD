using _4WEBD.Event.Data;
using _4WEBD.Event.Dtos.EventDto;
using _4WEBD.Event.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace _4WEBD.Event.Controllers;

public class EventController(
    EventContext context,
    /*EventManager<EventModel> eventManager,*/
    IConfiguration configuration,
    RoleManager<IdentityRole<Guid>> roleManager) : ControllerBase

{
    #region Properties
    
    private readonly EventContext _context;
    private readonly IConfiguration _configuration;
    

    #endregion
    
    /// <summary>
    /// Permet de creer un evenement
    /// </summary>
    /// <param name="eventDto"></param>
    /// <returns></returns>
    
    [HttpPost]
    [Route("create")]
    [AllowAnonymous]
    
    public async Task<IActionResult> Create([FromBody] EventDto eventDto)
    {
        var eventModel = new EventModel
        {
            FullName = eventDto.Name,
            Description = eventDto.Description,
            Date = eventDto.Date,
            Location = eventDto.Location,
            Image = eventDto.Image
        };
        await _context.AddAsync(eventModel);
        await _context.SaveChangesAsync();
        return Ok(new EventDtoResult(eventModel));
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
        return Ok(new EventDtoResult(eventModel));
    }
    
    
    
}