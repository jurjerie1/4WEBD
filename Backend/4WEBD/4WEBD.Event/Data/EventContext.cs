using System;
using _4WEBD.Event.Models;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Event.Data;

public class EventContext: DbContext
{
    public EventContext(DbContextOptions options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    public DbSet<EventModel> Events { get; set; }
}