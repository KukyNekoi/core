using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using think_agro_metrics.Models;

namespace think_agro_metrics.Data
{
    public class DataContext : DbContext
    {
        //En esta clase se deben declarar las entidades que se guardaran.
        //Cada uno de los  DbSet de abajo será una tabla en la base de datos.
        public DbSet<IndicatorGroup> IndicatorGroups { get; set; }
        public DbSet<Indicator> Indicators { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Registry> Registries { get; set; }
        public DbSet<LinkRegistry> LinkRegistries { get; set; } // This DbSet don't create a new table en the DB, but it's necessary to load the links
        public DbSet<LinkWrapper> Links { get; set; }

        public DataContext() : base()
        {
        }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        //Luego es necesario declarar  la forma de conexion
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //En este caso se  indica que usaremos SQLServer.
            //El campo Server corresponde a la direccion local  del servidor. Esta la  pillan en el 
            //comienzo  de la jerarquia en SMSS
            //El campo Database corresponde al nombre de  la base de datos a utilizar.
            //El otro ponganlo because of reasons.
            optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=think_agro_metrics;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // This allows the use of the private "type" as the backing field of the public Type
            // (map the value of "type" in the DB in the column corresponding to "Type")
            // Reference: https://docs.microsoft.com/en-us/ef/core/modeling/backing-field
            modelBuilder.Entity<Indicator>(indicator =>
            {
                modelBuilder.Entity<Indicator>()
                .Property(i => i.Type)
                .HasField("type");
            });

            modelBuilder.Entity<DefaultRegistry>();
            modelBuilder.Entity<ActivityRegistry>();
            modelBuilder.Entity<QuantityRegistry>();
            modelBuilder.Entity<PercentRegistry>();
            modelBuilder.Entity<LinkRegistry>();
        }

    }
}
