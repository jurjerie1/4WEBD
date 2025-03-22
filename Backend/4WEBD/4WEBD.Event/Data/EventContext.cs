using System;
using _4WEBD.Event.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace _4WEBD.Event.Data;

public class EventContext : DbContext
{
    // Changez cette ligne pour utiliser DbContextOptions<EventContext>
    public EventContext(DbContextOptions<EventContext> options) : base(options)
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

    public DbSet<EventModel> Events { get; set; }
}