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
        [Authorize(Roles = "admin")]

        public async Task<IActionResult> Create([FromForm] EditEventDto eventDto)
        {
            if (eventDto.Date < DateTime.UtcNow)
            {
                return BadRequest("Vous ne pouvez pas créer un événement dans le passé.");
            }
            var eventModel = new EventModel
            {
                Title = eventDto.Title,
                Description = eventDto.Description,
                Date = eventDto.Date,
                Location = eventDto.Location,
                NumberOfPlaces = eventDto.NumberOfPlaces,
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
        /// Permet de modifier un évenement
        /// </summary>
        /// <param name="id"></param>
        /// <param name="editEventDto"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] EditEventDto editEventDto)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("L'id de evenement est obligatoire.");
            }
            var eventModel = await _context.Events.FirstOrDefaultAsync(x => x.Id == id);
            if (eventModel == null)
            {
                return BadRequest("L'évenement est introuvable.");
            }
            if (editEventDto.Date < DateTime.UtcNow)
            {
                return BadRequest("Vous ne pouvez pas créer un événement dans le passé.");
            }
            eventModel.Title = editEventDto.Title;
            eventModel.Description = editEventDto.Description;
            eventModel.Date = editEventDto.Date;
            eventModel.Location = editEventDto.Location ?? eventModel.Location;
            eventModel.NumberOfPlaces = editEventDto.NumberOfPlaces;
            if (editEventDto.Image != null && editEventDto.Image.Length > 0)
            {
                try
                {
                    var file = editEventDto.Image;
                    var folderName = Path.Combine("Uploads", "Images");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                    Directory.CreateDirectory(pathToSave);

                    var extension = Path.GetExtension(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"'));

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

            _context.Events.Update(eventModel);
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
        /// <param name="page">La page actuel (0 par default)</param>
        /// <param name="pageSize">La taille de la page (50 par default)</param>
        /// <param name="location">Rechercher par ville</param>
        /// <param name="title">Rechercher par titre</param>
        /// <param name="date">Rechercher par date</param>
        [HttpGet]
        [Route("getall")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] int page = 0, [FromQuery] int pageSize = 50, [FromQuery] string location = "", [FromQuery] string title = "", [FromQuery] DateTime? date = null)
        {
            int pageSkip = page * pageSize;
            var query = _context.Events.AsQueryable();

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(x => x.Location.Contains(location));
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(x => x.Title.Contains(title));
            }

            if (date != null)
            {
                query = query.Where(x => x.Date >= date);
            }
            var events = await query.OrderByDescending(x => x.Date).Skip(pageSkip).Take(pageSize).ToListAsync();

            return Ok(events.Select(e => new EventDto(e)));
        }
    }
}
