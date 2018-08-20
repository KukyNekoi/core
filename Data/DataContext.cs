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
        public DbSet<Goal> Goals { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }

        public DataContext() : base()
        {
        }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

	private String connectionBuilder(){
		var server = Environment.GetEnvironmentVariable("MSSQL_SERVER");
		var database = Environment.GetEnvironmentVariable("MSSQL_DB");
		var user = Environment.GetEnvironmentVariable("MSSQL_USER");
		var password = Environment.GetEnvironmentVariable("MSSQL_PASSWORD");
		string connection = "Server=";
		if(server != null){
			connection +=server + ";";
		}
		else{
			connection +=".\\SQLEXPRESS;";
		}
		connection += "Database=";
		if(database != null){
			connection += database +";";
		}
		else{
			connection += "think_agro_metrics;";
		}
		if(user != null && password != null){
			connection += "User=" + user + ";";
			connection += "Password=" + password + ";";
		}
		connection += "MultipleActiveResultSets=True;";
		return connection;
	}

        //Luego es necesario declarar  la forma de conexion
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
	    optionsBuilder.UseSqlServer(connectionBuilder());
            //En este caso se  indica que usaremos SQLServer.
            //El campo Server corresponde a la direccion local  del servidor. Esta la  pillan en el 
            //comienzo  de la jerarquia en SMSS
            //El campo Database corresponde al nombre de  la base de datos a utilizar.
            //El otro ponganlo because of reasons.
            //optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=think_agro_metrics;Trusted_Connection=True;");
            // optionsBuilder.UseSqlServer("Server=127.0.0.1,1433;Database=think_agro;Integrated Security=False;User=sa;Password=Password1;MultipleActiveResultSets=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // This allows the use of the private "type" as the backing field of the public Type
            // (map the value of "type" in the DB in the column corresponding to "Type")
            // Reference: https://docs.microsoft.com/en-us/ef/core/modeling/backing-field
            modelBuilder.Entity<Indicator>(indicator =>
            {
                modelBuilder.Entity<Indicator>()
                .Property(i => i.RegistriesType)
                .HasField("registriesType");
            });
            modelBuilder.Entity<IndicatorGroup>();

            modelBuilder.Entity<DefaultRegistry>();
            modelBuilder.Entity<QuantityRegistry>();
            modelBuilder.Entity<PercentRegistry>();
            modelBuilder.Entity<ExternalRegistry>();
        }

    }
}
