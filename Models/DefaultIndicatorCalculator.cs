using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public class DefaultIndicatorCalculator : IIndicatorCalculator
    {
        public double Calculate(ICollection<Registry> registries)
        {           
            return registries.Count;
        }

        public double Calculate(ICollection<Registry> registries, int year)
        {   
            int counter = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year){
                    counter++;
                }
            }
            return counter;
        }

        public double Calculate(ICollection<Registry> registries, int year, int month)
        {   
            int counter = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year && registry.Date.Month == month){
                    counter++;
                }
            }
            return counter;
        }
    }
}
