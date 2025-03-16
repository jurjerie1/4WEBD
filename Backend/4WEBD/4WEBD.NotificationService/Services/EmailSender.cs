using System.Net.Mail;
using System.Net;
using _4WEBD.NotificationService.Services.Interfaces;

namespace _4WEBD.NotificationService.Services;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;
    
    public EmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        using (var client = new SmtpClient(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"]!)))
        {
            client.UseDefaultCredentials = false;
            client.Credentials =
                new NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Smtp:FromAddress"]!),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
