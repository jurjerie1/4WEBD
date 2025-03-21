using System;
using _4WEBD.Event.Models;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Event.Data;

public class EventContext : DbContext
{
    // Changez cette ligne pour utiliser DbContextOptions<EventContext>
    public EventContext(DbContextOptions<EventContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    public DbSet<EventModel> Events { get; set; }
}