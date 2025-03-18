using System;

namespace _4WEBD.NotificationService.Services.Interfaces;

public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string htmlMessage);

}
