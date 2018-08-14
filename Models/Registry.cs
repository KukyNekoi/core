using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public abstract class Registry
    {
        public long RegistryID { get; set; }
        public long IndicatorID { get; set; }
        public string Name { get; set; }
        public DateTime DateAdded { get; set; } // Date in which the registry is added
        public DateTime Date { get; set; } // Date when the registry occured
        public ICollection<Document> Documents { get; set; }
        public string Discriminator { get; set; }

        public Registry() {
            this.DateAdded = DateTime.Now;
            this.Date = DateTime.Today;
            this.Documents = new List<Document>();
        }
    }
}
