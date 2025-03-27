using System;
using _4WEBD.SharedClasses.Dtos.EventDto;
using _4WEBD.Ticket.models;

namespace _4WEBD.Ticket.Dtos.TicketDtos;

public class TicketDto
{
    #region Properties
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public EventDto Event { get; set; }
    public DateTime Date { get; set; }
    public int NumberOfPlaces { get; set; }
    public string Status { get; set; }

    #endregion

    #region Constructors
    public TicketDto(TicketModel ticket, EventDto eventDto)
    {
        Id = ticket.Id;
        UserId = ticket.UserId;
        Event = eventDto;
        Date = ticket.Date;
        NumberOfPlaces = ticket.NumberOfPlaces;
        Status = ticket.Status.ToString();
    }
    #endregion
}