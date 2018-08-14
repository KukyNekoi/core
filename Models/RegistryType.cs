using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public enum RegistryType
    {
        DefaultRegistry = 0, 
        QuantityRegistry = 1,
        PercentRegistry = 2,
        ExternalRegistry = 3
        // Add other types here if it's necessary
    }
}
