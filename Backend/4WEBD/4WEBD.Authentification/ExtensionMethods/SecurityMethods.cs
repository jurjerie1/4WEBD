using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using _4WEBD.Identity.Shared.ExtensionMethods;

namespace _4WEBD.Authentification.ExtensionMethods;

public static class SecurityMethods
{
    #region Constants

    public const string DefaultPolicy = "DEFAULT_POLICY";

    #endregion

    #region Public  Methods

    /// <summary>
    /// Ajoute la sécurité personnalisée à la collection de services.
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration">La configuration de l'application.</param>
    public static void AddCustomSecurity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCustomCors(configuration);

        services.AddCustomJwtAuthentication();
    }

    /// <summary>
    /// Ajoute des politiques CORS personnalisées à la collection de services.
    /// </summary>
    /// <param name="services">La collection de services.</param>
    /// <param name="configuration">La configuration de l'application.</param>
    public static void AddCustomCors(this IServiceCollection services, IConfiguration configuration)
    {
        string[] corsOrigins = configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();

        if (corsOrigins != null && corsOrigins.Length > 0)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(DefaultPolicy, builder =>
                {
                    builder.WithOrigins(corsOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
        }
        else
        {
            Console.WriteLine("Warning: CORS origins configuration is null or empty. No CORS policy will be set.");
        }
    }

    #endregion
}
