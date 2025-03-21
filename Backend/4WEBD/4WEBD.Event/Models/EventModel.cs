using System;

namespace _4WEBD.Event.Models;

public class EventModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public string Image { get; set; }

    #region Constructor
    public EventModel()
    {
        Id = Guid.NewGuid();
    }
    #endregion
}
