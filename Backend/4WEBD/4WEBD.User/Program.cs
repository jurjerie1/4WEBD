using System.Reflection;
using _4WEBD.Identity.Shared.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using _4WEBD.Identity.Shared.ExtensionMethods;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "4WEBD User API", Version = "v1" });
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

builder.Services.AddDbContext<IdentityContext>(options =>
{
        options.UseNpgsql(builder.Configuration.GetConnectionString("4WEBD_USER_DB"),
        b => b.MigrationsAssembly("4WEBD.User"));
});

builder.Services.AddCustomizedIdentity();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var identityUrl = builder.Configuration.GetValue<string>("IdentityUrl");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    options.Authority = identityUrl;
    options.RequireHttpsMetadata = false;
    options.Audience = "User";
});

var app = builder.Build();


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
        var context = services.GetRequiredService<IdentityContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
    }
}


app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();

app.Run();
