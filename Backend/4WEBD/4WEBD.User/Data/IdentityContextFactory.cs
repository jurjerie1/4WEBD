using _4WEBD.Identity.Shared.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace _4WEBD.User.Data
{
    public class IdentityContextFactory : IDesignTimeDbContextFactory<IdentityContext>
    {
        public IdentityContext CreateDbContext(string[] args)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            IConfigurationRoot configurationRoot = configurationBuilder.Build();

            DbContextOptionsBuilder builder = new DbContextOptionsBuilder();
            //builder.UseNpgsql(configurationRoot.GetConnectionString("4WEBD_USER_DB"));
            builder.UseNpgsql(configurationRoot.GetConnectionString("4WEBD_USER_DB"),
                    b => b.MigrationsAssembly("4WEBD.User"));
            IdentityContext context = new IdentityContext(builder.Options);


            return context;
        }
    }
}
