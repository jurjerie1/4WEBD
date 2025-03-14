using Ocelot.DependencyInjection;
using MMLib.SwaggerForOcelot.DependencyInjection;
using _4WEBD.Gateways;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("configuration/ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOcelot();
builder.Services.AddSwaggerForOcelot(builder.Configuration);

// Ajout des cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwaggerForOcelotUI(opt =>
{
    opt.PathToSwaggerGenerator = "/swagger/docs";
}).UseMiddleware<DependencyCheckMiddleware>();

app.Run();
