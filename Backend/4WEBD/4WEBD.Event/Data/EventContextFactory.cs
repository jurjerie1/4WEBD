using Microsoft.EntityFrameworkCore;
namespace _4WEBD.Event.Data;

public class EventContextFactory
{
    
    public EventContext CreateDbContext(string[] args)
    {
        ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
        IConfigurationRoot configurationRoot = configurationBuilder.Build();
        
        DbContextOptionsBuilder builder = new DbContextOptionsBuilder();
        builder.UseNpgsql(configurationRoot.GetConnectionString("supmap_identity"));
        
        //SelfiesContext context = new SelfiesContext((DbContextOptions<SelfiesContext>)builder.Options);
        //création du contexte avec le selficontext et les options
        EventContext context = new EventContext(builder.Options);
        
        
        return context;
    }
    
}