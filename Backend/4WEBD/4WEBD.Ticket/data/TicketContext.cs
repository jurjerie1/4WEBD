using System;
using _4WEBD.Ticket.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace _4WEBD.Ticket.data;

public class TicketContext : DbContext
{
    // Changez cette ligne pour utiliser DbContextOptions<EventContext>
    public TicketContext(DbContextOptions<TicketContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
        v => v.ToUniversalTime(),
        v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
    );

    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        foreach (var property in entityType.GetProperties())
        {
            if (property.ClrType == typeof(DateTime))
                property.SetValueConverter(dateTimeConverter);
        }
    }

        base.OnModelCreating(modelBuilder);
    }

    public DbSet<TicketModel> Tickets { get; set; }
    public DbSet<ConfirmationTicket> ConfirmationTickets { get; set; }
}