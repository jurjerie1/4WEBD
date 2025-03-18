using System;

namespace _4WEBD.NotificationService.Razor.Template.Views.Emails;

public class ConfirmeEmailTemplateModel
{
    #region Properties
    public required string UserName { get; set; }
    public required string Url { get; set; }

    #endregion
}
