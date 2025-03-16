using System;

namespace _4WEBD.SharedClasses;

public class SendMailMessage
{
    #region Properties

    public required string To { get; set; }// Adresse e-mail du destinataire
    public required string UserName { get; set; }// Contenu du message
    public TemplateId TemplateId { get; set; } // ID du template à utiliser
    public string? Url { get; set; }
    public Guid UserId { get; set; }

    #endregion

}

public enum TemplateId
{
    ConfirmeEmailTemplate = 1,
}

