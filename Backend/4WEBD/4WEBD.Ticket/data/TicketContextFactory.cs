using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace _4WEBD.Ticket.data;

public class TicketContextFactory: IDesignTimeDbContextFactory<TicketContext>
{
    public TicketContext CreateDbContext(string[] args)
    {
        var configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        var configurationRoot = configurationBuilder.Build();
        
        var optionsBuilder = new DbContextOptionsBuilder<TicketContext>();
        optionsBuilder.UseNpgsql(configurationRoot.GetConnectionString("4webd_ticket"));
        
        return new TicketContext(optionsBuilder.Options);
    }
}