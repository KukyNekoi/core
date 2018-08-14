using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public class Goal
    {
        public long GoalID { get; set; }
        public int Year { get; set; }
        public int Month { get; set; } 
        public double Value { get; set; }

        public long IndicatorID { get; set; }
    }
}
