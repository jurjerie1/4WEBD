using _4WEBD.Event.Models;

namespace _4WEBD.Event.Dtos.EventDto;

public class EventDtoResult
{
    #region Properties

    
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
    
    

    #endregion
    #region Constructors
    public EventDtoResult(EventModel eventModel)
    {
        Id = eventModel.Id;
        Name = eventModel.FullName;
        Description = eventModel.Description;
        Image = eventModel.Image;
    }
    #endregion
    
}