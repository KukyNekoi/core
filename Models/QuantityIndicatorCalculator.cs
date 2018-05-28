using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public class QuantityIndicatorCalculator : IIndicatorCalculator
    {
        public double Calculate(ICollection<Registry> registries)
        {
            int sum = 0;
            foreach (Registry registry in registries) {
                sum += (registry as QuantityRegistry).Quantity;
            }
            return sum;
        }

        public double Calculate(ICollection<Registry> registries,int year)
        {
            int sum = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year) {
                    sum += (registry as QuantityRegistry).Quantity;
                }
            }
            return sum;
        }

        public double Calculate(ICollection<Registry> registries,int year, int month)
        {
            int sum = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year && registry.Date.Month == month) {
                    sum += (registry as QuantityRegistry).Quantity;
                }
            }
            return sum;
        }
    }
}
