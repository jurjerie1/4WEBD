using System;

namespace _4WEBD.SharedClasses.Dtos.EventDto;

public class EventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public string Image { get; set; }
    public int NumberOfPlaces { get; set; }

}
