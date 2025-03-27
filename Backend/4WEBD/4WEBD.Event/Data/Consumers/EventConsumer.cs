using System;
using System.Linq.Expressions;
using _4WEBD.SharedClasses.Dtos.EventDto;
using _4WEBD.SharedClasses.Event;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Event.Data.Consumers;

/// <summary>
/// Event consumer class
/// </summary>
/// <param name="context"></param>
/// <param name="logger"></param>
/// <param name="configuration"></param>
public class EventConsumer(EventContext context, ILogger<EventConsumer> logger, IConfiguration configuration) : IConsumer<GetEventInfo>
{
    #region Properties
    private readonly ILogger<EventConsumer> _logger = logger;
    private readonly IConfiguration _configuration = configuration;
    private readonly EventContext _context = context;
    #endregion

    /// <summary>
    /// Consume method
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task Consume(ConsumeContext<GetEventInfo> context)
    {
        var message = context.Message;
        _logger.LogInformation($"Received message {message.EventIds}");

        List<EventDto> eventInfo = new List<EventDto>();
        if (message.EventIds.Count() > 0)
        {
            foreach (var eventId in message.EventIds)
            {
                var eventInfoItem = await _context.Events.Where(x => x.Id == eventId).FirstOrDefaultAsync();
                if (eventInfoItem != null)
                {
                    eventInfo.Add(new EventDto()
                    {
                        Id = eventInfoItem.Id,
                        Title = eventInfoItem.Title,
                        Description = eventInfoItem.Description,
                        Date = eventInfoItem.Date,
                        NumberOfPlaces = eventInfoItem.NumberOfPlaces,
                        Location = eventInfoItem.Location,
                        Image = "/Event/Images/"+eventInfoItem.Image
                        
                    });
                }
            }
        }
        await context.RespondAsync<EventInfoResponse>(new EventInfoResponse{Events = eventInfo});
    }
}