using System.Reflection;
using _4WEBD.Event.Data;
using _4WEBD.Event.Data.Consumers;
using _4WEBD.Identity.Shared.ExtensionMethods;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "4WEBD Event API", Version = "v1" });
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

builder.Services.AddDbContext<EventContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("4webd_event")
    )
);

builder.Services.AddCustomJwtAuthentication();
builder.Services.AddScoped<EventConsumer>();
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EventConsumer>();
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RABBITMQ_CONNECTIONSTRING"]);
        cfg.ConfigureEndpoints(context);
        cfg.ReceiveEndpoint("getEventInfo-queue", e =>
        {
            e.ConfigureConsumer<EventConsumer>(context);
        });
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<EventContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
    }
}

// Ensure uploads directory exists
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "Uploads", "Images");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    // Ensure directory has proper permissions
    try
    {
        // Set permissions (works in Unix-based systems like in Docker)
        if (!OperatingSystem.IsWindows())
        {
            // This doesn't do anything on Windows but works on Linux/Docker
            var permissions = (UnixFileMode)Convert.ToInt32("777", 8); // equivalent to 777 in octal
            File.SetUnixFileMode(uploadsPath, permissions);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: Could not set directory permissions: {ex.Message}");
    }
}

// Configure static files middleware
app.UseStaticFiles(); // Default static files (wwwroot)

// Configure the images path for static file serving
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/Event/Images"
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();