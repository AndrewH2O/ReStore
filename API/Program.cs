using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            
            //CreateHostBuilder(args).Build().Run();
            var host = CreateHostBuilder(args).Build();
            
            // auto disposal of resources  once used
            // using is easier than adding a finally block and saying scope.dispose()
            // in this way it will be gc'd
            using var scope = host.Services.CreateScope();
            
            
            var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            
            // we don't have exception class yet so add logger
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                // applies any outstanding migrations and db updates
                // does same thing as db command line 
                // dotnet ef database update
                await context.Database.MigrateAsync();
                await DbInitializer.Initialize(context, userManager);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "problem migrating data");
            }
            
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
