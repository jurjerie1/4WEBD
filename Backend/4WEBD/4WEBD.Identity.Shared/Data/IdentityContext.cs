using System;
using _4WEBD.Identity.Shared.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.Identity.Shared.Data;

public class IdentityContext: IdentityDbContext<UserModel, IdentityRole<Guid>, Guid>
{
    public IdentityContext(DbContextOptions options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}