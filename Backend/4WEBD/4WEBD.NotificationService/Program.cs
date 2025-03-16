using _4WEBD.NotificationService;
using _4WEBD.NotificationService.Services;
using _4WEBD.NotificationService.Services.Interfaces;
using MassTransit;

var builder = Host.CreateApplicationBuilder(args);


builder.Services.AddRazorTemplating();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddSingleton<IEmailSender, EmailSender>();

builder.Services.AddRazorTemplating();

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<SendMailConsumer>();
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RABBITMQ_CONNECTIONSTRING"]);
        cfg.ReceiveEndpoint("sendMail-queue", e =>
        {
            e.ConfigureConsumer<SendMailConsumer>(context);
        });
    });
});

var host = builder.Build();
host.Run();
