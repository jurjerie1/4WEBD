using System.Net.Http.Headers;
using _4WEBD.Event.Data;
using _4WEBD.Event.Dtos.EventDto;
using _4WEBD.Event.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Event.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class EventController(EventContext context, IConfiguration configuration) : ControllerBase
    {
        #region Properties

        private readonly EventContext _context = context;
        private readonly IConfiguration _configuration = configuration;


        #endregion


        /// <summary>
        /// Permet de creer un evenement
        /// </summary>
        /// <param name="eventDto"></param>
        /// <returns></returns>
        [HttpPost("create")]
        // [Authorize(Roles = "admin")]

        public async Task<IActionResult> Create([FromForm] EditEventDto eventDto)
        {
            var eventModel = new EventModel
            {
                Title = eventDto.Title,
                Description = eventDto.Description,
                Date = eventDto.Date,
                Location = eventDto.Location,
            };

            if (eventDto.Image != null && eventDto.Image.Length > 0)
            {
                try
                {
                    var file = eventDto.Image;
                    var folderName = Path.Combine("Uploads", "Images");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                    Directory.CreateDirectory(pathToSave);

                    var extension = Path.GetExtension(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'));

                    var fileName = $"{eventModel.Id}{extension}";

                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    eventModel.Image = fileName;
                }
                catch (Exception e)
                {
                    return BadRequest($"L'image n'a pas pu être enregistrée. Erreur: {e.Message}");
                }
            }
            else
            {
                return BadRequest("L'image est obligatoire");
            }

            await _context.Events.AddAsync(eventModel);

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

        /// <summary>
        /// Permet de recuperer tous les evenements
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getall")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var events = await _context.Events.ToListAsync();
            return Ok(events.Select(e => new EventDto(e)));
        }
    }
}
