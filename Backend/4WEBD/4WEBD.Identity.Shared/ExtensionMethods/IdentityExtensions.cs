using System;
using System.Text;
using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Console;
using Microsoft.IdentityModel.Tokens;

namespace _4WEBD.Identity.Shared.ExtensionMethods;

public static class IdentityExtensions
{

    public static IServiceCollection AddCustomizedIdentity(this IServiceCollection services)
    {
        services.AddIdentity<UserModel, IdentityRole<Guid>>(options =>
        {
            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+é& ";
            options.User.RequireUniqueEmail = true;

            options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
            options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
        })
        .AddEntityFrameworkStores<IdentityContext>()
        .AddDefaultTokenProviders()
        .AddRoles<IdentityRole<Guid>>()
        .AddTokenProvider<EmailTokenProvider<UserModel>>("DefaultEmailProvider");


        return services;
    }

    public static void AddCustomJwtAuthentication(this IServiceCollection services)
    {
        IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        IConfigurationRoot configurationRoot = configurationBuilder.Build();

        var key = Encoding.UTF8.GetBytes(configurationRoot["Jwt:Key"]);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
       .AddJwtBearer(options =>
       {
           options.RequireHttpsMetadata = false;
           options.SaveToken = true;
           options.TokenValidationParameters = new TokenValidationParameters
           {
               ValidateIssuerSigningKey = true,
               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configurationRoot["Jwt:Key"])),
               ValidateIssuer = false,
               ValidateAudience = false,
           };
       });
    }
}
