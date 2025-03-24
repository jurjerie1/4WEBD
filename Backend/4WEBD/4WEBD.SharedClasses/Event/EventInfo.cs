using System;

namespace _4WEBD.SharedClasses.Event;

public class EventInfo
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public int NumberOfPlaces { get; set; }
    public int ReservedPlaces { get; set; }
    public string Location { get; set; }
}
