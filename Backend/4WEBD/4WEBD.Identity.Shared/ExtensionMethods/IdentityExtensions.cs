using System;
using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

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
}
