using System;
using System.ComponentModel.DataAnnotations;
using _4WEBD.Event.Models;

namespace _4WEBD.Event.Dtos.EventDto;

public class EventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public string Image { get; set; }
    
    #region Constructor
    public EventDto(EventModel eventModel)
    {
        Id = eventModel.Id;
        Title = eventModel.Title;
        Description = eventModel.Description;
        Date = eventModel.Date;
        Location = eventModel.Location;
    }
    #endregion
}
