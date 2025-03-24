using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
namespace _4WEBD.NotificationService.Razor.Template.Views.Emails;

    public class ConfirmTicketTemplateModel : PageModel
    {
       public required string UserName { get; set; }
        public required string Url { get; set; }
        public required string EventName { get; set; }
        public required string EventDate { get; set; }
        public required string NumberOfPlaces { get; set; }
    }
