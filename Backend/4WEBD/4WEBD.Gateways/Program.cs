using Ocelot.DependencyInjection;
using MMLib.SwaggerForOcelot.DependencyInjection;
using _4WEBD.Gateways;
using Ocelot.Middleware;
using _4WEBD.Identity.Shared.ExtensionMethods;

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

builder.Services.AddCustomJwtAuthentication();

var app = builder.Build();

app.UseSwaggerForOcelotUI(opt =>
{
    opt.PathToSwaggerGenerator = "/swagger/docs";
}).UseMiddleware<DependencyCheckMiddleware>();

app.UseCors("AllowAllOrigins");

await app.UseOcelot();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
