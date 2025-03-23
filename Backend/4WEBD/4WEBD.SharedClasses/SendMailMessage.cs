using System;

namespace _4WEBD.SharedClasses;

public class SendMailMessage
{
    #region Properties

    public required string To { get; set; }
    public required string UserName { get; set; }
    public TemplateId TemplateId { get; set; } 
    public string? Url { get; set; }
    public Guid UserId { get; set; }
    public string? AutreInfo { get; set; }

    #endregion

}

public enum TemplateId
{
    ConfirmeEmailTemplate = 1,
    ConfirmTicketTemplate = 2,
    CancelledTicketTemplate = 3,
}

