using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace think_agro_metrics.Models
{
    public class ExternalRegistry : Registry
    {
        public string CompanyName { get; set; }

        public ExternalRegistry() { }
    }
}
