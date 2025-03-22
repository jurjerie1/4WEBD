using System;

namespace _4WEBD.Ticket.models;

public class TicketModel
{
    #region Properties

    public Guid Id { get; set; }
    public Guid? EventId {get; set;}
    public int NumberOfPlaces {get; set;}
    public DateTime Date {get; set;}
    public Guid UserId {get; set;}

    #endregion

    #region Constructor
    public TicketModel()
    {
        Id = new Guid();
        Date = DateTime.UtcNow;
    }
    #endregion
}
