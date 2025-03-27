using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using _4WEBD.SharedClasses;
using _4WEBD.SharedClasses.Dtos.EventDto;
using _4WEBD.SharedClasses.Event;
using _4WEBD.Ticket.data;
using _4WEBD.Ticket.Dtos.TicketDtos;
using _4WEBD.Ticket.models;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Ticket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController(TicketContext context, ISendEndpointProvider sendEndpointProvider, IBus bus, IConfiguration configuration) : ControllerBase
    {
        #region Properties
        private readonly TicketContext _context = context;
        private readonly ISendEndpointProvider _sendEndpointProvider = sendEndpointProvider;
        private readonly IBus _bus = bus;
        private readonly IConfiguration _configuration = configuration;
        #endregion

        /// <summary>
        /// Permet de récupérer tous les tickets de l'utilisateur connecté.
        /// </summary>
        /// <returns></returns>
        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetAllUserTickets([FromQuery] int page = 0, [FromQuery] int pageSize = 10, [FromQuery] DateTime? date = null, [FromQuery] bool isCancelled = false)
        {
            string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            if (userId == "")
            {
                return NotFound("Utilisateur non trouvé.");
            }
            int skip = page * pageSize;
            var query = _context.Tickets.Skip(skip).Take(10).Where(t => t.UserId.ToString() == userId).AsQueryable();
            if (date != null)
            {
                query = query.Where(t => t.Date.Date >= date.Value.Date);
            }
            else
            {
                query = query.Where(t => t.Date >= DateTime.UtcNow);
            }
            if (isCancelled)
            {
                query = query.Where(t => t.Status == TicketStatus.Cancelled);
            }
            else
            {
                query = query.Where(t => t.Status != TicketStatus.Cancelled);
            }
            var tickets = await query.ToListAsync();
            try
            {
                var message = new GetEventInfo
                {
                    EventIds = tickets.Select(x => x.EventId).ToList()
                };

                var client = _bus.CreateRequestClient<GetEventInfo>(new Uri("queue:getEventInfo-queue"), TimeSpan.FromSeconds(30));


                var response = await client.GetResponse<EventInfoResponse>(message);
                var events = response.Message.Events;
                return Ok(tickets.Select(x => new TicketDto(x, events.First(e => e.Id == x.EventId))));
            }
            catch (Exception)
            {
                return BadRequest("Un problème est survenu lors de la récupération des informations des événements.");
            }
        }

        /// <summary>
        /// Permet de récupérer un ticket par son id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTicketById(Guid id)
        {
            string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            if (userId == "")
            {
                return NotFound("Utilisateur non trouvé.");
            }
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null)
            {
                return NotFound("Ticket non trouvé.");
            }
            if (ticket.UserId.ToString() != userId && !HttpContext.User.IsInRole("admin"))
            {
                return Unauthorized("Vous n'avez pas le droit de consulter ce ticket.");
            }
            try
            {
                var message = new GetEventInfo
                {
                    EventIds = new List<Guid> { ticket.EventId },
                };

                var client = _bus.CreateRequestClient<GetEventInfo>(new Uri("queue:getEventInfo-queue"), TimeSpan.FromSeconds(30));
                var response = await client.GetResponse<EventInfoResponse>(message);
                var events = response.Message.Events;
                return Ok(new TicketDto(ticket, events.First()));
            }
            catch (Exception)
            {
                return BadRequest("Un problème est survenu lors de la récupération des informations des événements.");
            }
        }

        /// <summary>
        /// Permet de récupérer tous les tickets (admin)
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        [HttpGet("getAll")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllTickets([FromQuery] int page = 0, [FromQuery] int pageSize = 10, [FromQuery] DateTime? date = null, [FromQuery] Guid? eventId = null)
        {
            int skip = page * pageSize;
            var query = _context.Tickets.Skip(skip).Take(pageSize).AsQueryable();
            if (date != null)
            {
                query = query.Where(t => t.Date.Date >= date.Value.Date);
            }
            else
            {
                query = query.Where(t => t.Date >= DateTime.UtcNow);
            }
            if (eventId != Guid.Empty)
            {
                query = query.Where(t => t.EventId == eventId);
            }
            var tickets = await query.ToListAsync();
            try
            {
                var message = new GetEventInfo
                {
                    EventIds = tickets.Select(x => x.EventId).ToList()
                };

                var client = _bus.CreateRequestClient<GetEventInfo>(new Uri("queue:getEventInfo-queue"), TimeSpan.FromSeconds(30));
                var response = await client.GetResponse<EventInfoResponse>(message);
                var events = response.Message.Events;
                return Ok(tickets.Select(x => new TicketDto(x, events.First(e => e.Id == x.EventId))));
            }
            catch (Exception)
            {
                return BadRequest("Un problème est survenu lors de la récupération des informations des événements.");
            }
        }

        /// <summary>
        /// Permet de créer un ticket
        /// </summary>
        /// <param name="ticket"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTicket([FromBody] EditTicketDto ticketDto)
        {
            string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            string? userName = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "name")?.Value;
            string? userEmail = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Email);

            if (userId == "")
            {
                return NotFound("Utilisateur non trouvé.");
            }
            try
            {
                var message = new GetEventInfo
                {
                    EventIds = new List<Guid> { ticketDto.EventId },
                };

                var client = _bus.CreateRequestClient<GetEventInfo>(new Uri("queue:getEventInfo-queue"), TimeSpan.FromSeconds(30));

                var response = await client.GetResponse<EventInfoResponse>(message);
                var events = response.Message.Events;
                if (events.Count == 0)
                {
                    return NotFound("L'évement donné n'existe pas.");
                }
                TicketModel ticket = new TicketModel
                {
                    EventId = ticketDto.EventId,
                    NumberOfPlaces = ticketDto.NumberOfPlaces,
                    Date = DateTime.UtcNow,
                    UserId = Guid.Parse(userId),
                    Status = TicketStatus.Pending
                };
                await _context.Tickets.AddAsync(ticket);
                ConfirmationTicket confirmationTicket = new ConfirmationTicket
                {
                    TicketId = ticket.Id,
                    Action = TicketAction.Confirm
                };
                await _context.ConfirmationTickets.AddAsync(confirmationTicket);

                var mailMessage = new SendMailMessage
                {
                    To = userEmail,
                    TemplateId = TemplateId.ConfirmTicketTemplate,
                    Url = "confirm?ticketId=" + ticket.Id + "&confirmToken=" + confirmationTicket.ConfirmToken,
                    UserName = userName,
                    UserId = Guid.Parse(userId),
                    AutreInfo = events.First().Title + ";" + events.First().Date + ";" + ticketDto.NumberOfPlaces
                };

                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:sendMail-queue"));


                await endpoint.Send<SendMailMessage>(mailMessage);



                await _context.SaveChangesAsync();
                return Ok(new { ticket = new TicketDto(ticket, events.First()), message = "Ticket créé avec succès, veuillez confirmer votre réservation." });
            }
            catch (Exception)
            {
                return BadRequest("Un problème est survenu lors de la reservation du ticket.");
            }

        }

        [HttpGet("confirm/{ticketId}/{confirmToken}")]
        [Authorize]
        public async Task<IActionResult> ConfirmAction(Guid ticketId, string confirmToken)
        {
            string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            if (userId == "")
            {
                return NotFound("Utilisateur non trouvé.");
            }

            var confirmationTicket = await _context.ConfirmationTickets.FirstOrDefaultAsync(t => t.TicketId == ticketId && t.ConfirmToken == confirmToken);
            if (confirmationTicket == null)
            {
                return NotFound("Ticket non trouvé.");
            }

            if (confirmationTicket.Date.AddMinutes(10) < DateTime.UtcNow)
            {
                return BadRequest("Le token de confirmation a expiré.");
            }

            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);
            if (ticket == null)
            {
                return NotFound("Ticket non trouvé.");
            }

            if (ticket.UserId.ToString() != userId)
            {
                return Unauthorized("Vous n'avez pas le droit de confirmer cette action.");
            }

            if (confirmationTicket.ConfirmToken != confirmToken)
            {
                _context.ConfirmationTickets.Remove(confirmationTicket);
                await _context.SaveChangesAsync();
                if (confirmationTicket.Action == TicketAction.Confirm)
                {
                    ticket.Status = TicketStatus.Cancelled;
                    _context.Tickets.Update(ticket);
                    await _context.SaveChangesAsync();
                    return BadRequest("Token de confirmation invalide, la réservation a été annulée.");
                }
                if (confirmationTicket.Action == TicketAction.Delete)
                {
                    return BadRequest("Token de confirmation invalide, la demande de suppression a été annulée.");
                }
            }

            if (confirmationTicket.Action == TicketAction.Confirm)
            {
                ticket.Status = TicketStatus.Confirmed;
                _context.Tickets.Update(ticket);
                _context.ConfirmationTickets.Remove(confirmationTicket);
                await _context.SaveChangesAsync();
                return Ok("La demande de réservation a été confirmée.");
            }

            if (confirmationTicket.Action == TicketAction.Delete)
            {
                ticket.Status = TicketStatus.Cancelled;
                _context.Tickets.Update(ticket);
                _context.ConfirmationTickets.Remove(confirmationTicket);
                await _context.SaveChangesAsync();
                return Ok("La reservation a été annulée.");
            }

            return BadRequest("Action non reconnue.");
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTicket(Guid id)
        {
            string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
            string? userName = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "name")?.Value;
            string? userEmail = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Email);
            if (userId == "")
            {
                return NotFound("Utilisateur non trouvé.");
            }
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null)
            {
                return NotFound("Ticket non trouvé.");
            }
            if (ticket.UserId.ToString() != userId)
            {
                return Unauthorized("Vous n'avez pas le droit de supprimer ce ticket.");
            }
            _context.ConfirmationTickets.RemoveRange(_context.ConfirmationTickets.Where(t => t.TicketId == id));
            await _context.SaveChangesAsync();
            ConfirmationTicket confirmationTicket = new ConfirmationTicket
            {
                TicketId = ticket.Id,
                Action = TicketAction.Delete
            };
            await _context.ConfirmationTickets.AddAsync(confirmationTicket);

            var mailMessage = new SendMailMessage
            {
                To = userEmail,
                TemplateId = TemplateId.CancelledTicketTemplate,
                Url = "confirm?ticketId=" + ticket.Id + "&confirmToken=" + confirmationTicket.ConfirmToken,
                UserName = userName,
                UserId = Guid.Parse(userId),
            };
            var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:sendMail-queue"));

            await endpoint.Send<SendMailMessage>(mailMessage);
            await _context.SaveChangesAsync();
            return Ok("Un e-mail de confirmation a été envoyé à l'adresse e-mail associée à votre compte.");
        }

    }
}