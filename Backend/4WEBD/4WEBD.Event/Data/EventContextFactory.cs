using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace _4WEBD.Event.Data;

public class EventContextFactory : IDesignTimeDbContextFactory<EventContext>
{
    public EventContext CreateDbContext(string[] args)
    {
        var configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        var configurationRoot = configurationBuilder.Build();
        
        var optionsBuilder = new DbContextOptionsBuilder<EventContext>();
        optionsBuilder.UseNpgsql(configurationRoot.GetConnectionString("4webd_event"));
        
        return new EventContext(optionsBuilder.Options);
    }
}