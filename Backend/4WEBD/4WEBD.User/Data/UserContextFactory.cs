using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.User.Data;

public class UserContextFactory
{
    public UserContext CreateDbContext(string[] args)
    {
        ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        IConfigurationRoot configurationRoot = configurationBuilder.Build();

        DbContextOptionsBuilder builder = new DbContextOptionsBuilder();
        builder.UseNpgsql(configurationRoot.GetConnectionString("supmap_identity"));

        //SelfiesContext context = new SelfiesContext((DbContextOptions<SelfiesContext>)builder.Options);
        //création du contexte avec le selficontext et les options
        UserContext context = new UserContext(builder.Options);


        return context;
    }

}
