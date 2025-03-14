using System;
using Swashbuckle.AspNetCore.Swagger;

namespace _4WEBD.Gateways;

public class DependencyCheckMiddleware
{
    private readonly RequestDelegate _next;

    public DependencyCheckMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        try
        {
            var swaggerGen = serviceProvider.GetService<ISwaggerProvider>();
            if (swaggerGen == null)
            {
                throw new Exception("SwaggerProvider n'a pas été résolu.");
            }

            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync($"Erreur de résolution de dépendances : {ex.Message}");
        }
    }
}
