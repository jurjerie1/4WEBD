using System;
using _4WEBD.NotificationService.Services;
using _4WEBD.NotificationService.Razor.Template.Views.Emails;
using _4WEBD.SharedClasses;
using MassTransit;
using Razor.Templating.Core;

namespace _4WEBD.NotificationService;

public class SendMailConsumer : IConsumer<SendMailMessage>
{
    private readonly EmailSender _emailService;
    private readonly ILogger<SendMailConsumer> _logger;
    private readonly IConfiguration _configuration;

    public SendMailConsumer(EmailSender emailService, ILogger<SendMailConsumer> logger, IConfiguration configuration)
    {
        _emailService = emailService;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task Consume(ConsumeContext<SendMailMessage> context)
    {
        var message = context.Message;
        _logger.LogInformation($"Received message {message.UserName}");
        //await _emailService.SendEmailAsync(message.To, "Test Email", message.Url);
        if (message.TemplateId == TemplateId.ConfirmeEmailTemplate)
        {
            var html = "";
            string url = _configuration["ApplicationFrontUrl"] + $"/ConfirmeEmail?UserId={message.UserId}&Token=" + message.Url;
            try
            {
                html = await RazorTemplateEngine.RenderAsync("Emails/ConfirmeEmailTemplate",
                    new ConfirmeEmailTemplateModel { UserName = message.UserName, Url = url });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Détails complets de l'erreur: {ex.ToString()}");

                var files = Directory.GetFiles(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Views", "Emails"));
                _logger.LogInformation($"Fichiers trouvés : {string.Join(", ", files)}");
                throw;
            }
            await _emailService.SendEmailAsync(message.To, "Bienvenue chez 4WEBD  - Confirmation de votre compte", html);
        }
        await Task.CompletedTask;
    }
}