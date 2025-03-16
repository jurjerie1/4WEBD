using System.Reflection;
using _4WEBD.Authentification.ExtensionMethods;
using _4WEBD.Identity.Shared.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using _4WEBD.Identity.Shared.ExtensionMethods;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "4WEBD Authentification API", Version = "v1" });
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description =
            "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});
// Ajout de MassTransit
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RABBITMQ_CONNECTIONSTRING"]);
        cfg.ConfigureEndpoints(context);
        
    });
});

builder.Services.AddMassTransitHostedService();

// Ajout de la sécurité Cors et Authentification
builder.Services.AddCustomSecurity(builder.Configuration);

// Ajout de la connexion à la base de données
builder.Services.AddDbContext<IdentityContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("4WEBD_USER_DB"));
});
builder.Services.AddCustomizedIdentity();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
