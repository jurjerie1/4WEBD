using System;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace _4WEBD.Event.Data;

public class EventContextFactory
{
public EventContext CreateDbContext(string[] args)
    {
        ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        IConfigurationRoot configurationRoot = configurationBuilder.Build();
        
        DbContextOptionsBuilder builder = new DbContextOptionsBuilder();
        builder.UseNpgsql(configurationRoot.GetConnectionString("4webd_event"));
        
        EventContext context = new EventContext(builder.Options);
        
        
        return context;
    }
}
