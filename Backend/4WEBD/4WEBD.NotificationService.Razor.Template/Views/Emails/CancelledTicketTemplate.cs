using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
namespace _4WEBD.NotificationService.Razor.Template.Views.Emails;

public class CancelledTicketTemplateModel : PageModel
{
    public required string UserName { get; set; }
    public required string Url { get; set; }
    public required string EventName { get; set; }
    public required string EventDate { get; set; }
}
