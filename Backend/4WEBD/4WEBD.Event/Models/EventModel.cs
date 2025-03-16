using Microsoft.AspNetCore.Identity;
namespace _4WEBD.Event.Models;

public class EventModel : IdentityUser<Guid>
{
    public string FullName { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Location { get; set; }
    public string Image { get; set; }
   
}