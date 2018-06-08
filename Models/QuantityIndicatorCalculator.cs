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
            long sum = 0;
            foreach (Registry registry in registries) {
                if(registry is QuantityRegistry)
                    sum += (registry as QuantityRegistry).Quantity;
                else
                    throw new TypeAccessException("QuantityIndicatorCalculator can't work over this type of registry");
            }
            return sum;
        }

        public double Calculate(ICollection<Registry> registries,int year)
        {
            long sum = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year) {
                    if(registry is QuantityRegistry)
                        sum += (registry as QuantityRegistry).Quantity;
                    else
                        throw new TypeAccessException("QuantityIndicatorCalculator can't work over this type of registry");
                }
            }
            return sum;
        }

        public double Calculate(ICollection<Registry> registries,int year, int month)
        {
            long sum = 0;
            foreach (Registry registry in registries) {
                if(registry.Date.Year == year && registry.Date.Month == month) {
                    if(registry is QuantityRegistry)
                        sum += (registry as QuantityRegistry).Quantity;
                    else
                        throw new TypeAccessException("QuantityIndicatorCalculator can't work over this type of registry");
                }
            }
            return sum;
        }

        public double[] CalculateChartData(ICollection<Registry> registries)
        {
            List<double> chartData = new List<double>();
            //Count the registries for every month of every year
            for (int i = 0; i < registries.Count; i++)
            {
                Registry registry = registries.ElementAt(i);
                int year = registry.Date.Year;
                int month = registry.Date.Month;
                try
                {
                    //This could throw an exception (index out of bounds)
                    chartData[(year - 2018 * 12) + month - 1] += (registry as QuantityRegistry).Quantity;
                }
                catch
                {
                    // Add data to fix the exception
                    chartData.Add(0);
                    i--; //Repeat until it's possible to access to the index
                }
            }

            //Cumulative sum of the data
            for (int i = 1; i < chartData.Count; i++)
            {
                chartData[i] += chartData[i - 1];
            }

            return chartData.ToArray();
        }

        public double[] CalculateChartDataYear(ICollection<Registry> registries, int year)
        {
            //List<double> chartData = new List<double>();
            double[] chartData = new double[12];

            //Count the registries for every month of every year
            for (int i = 0; i < registries.Count; i++)
            {
                Registry registry = registries.ElementAt(i);
                int month = registry.Date.Month;
                if (registry.Date.Year == year)
                {
                    //try
                    //{
                    //This could throw an exception (index out of bounds)
                    chartData[month - 1] += (registry as QuantityRegistry).Quantity;
                    //}
                    //catch
                    //{
                    // Add data to fix the exception
                    //chartData.Add(0);
                    //i--; //Repeat until it's possible to access to the index
                    //}
                }

            }

            //Cumulative sum of the data
            //for (int i = 1; i < chartData.Count; i++)
            for (int i = 1; i < chartData.Length; i++)
            {
                chartData[i] += chartData[i - 1];
            }

            //return chartData.ToArray();
            return chartData;
        }

        public double[] CalculateChartDataYearMonth(ICollection<Registry> registries, int year, int month)
        {
            //List<double> chartData = new List<double>();
            int daysInMonth = DateTime.DaysInMonth(year, month);
            double[] chartData = new double[daysInMonth];

            //Count the registries for every month of every year
            for (int i = 0; i < registries.Count; i++)
            {
                Registry registry = registries.ElementAt(i);
                int day = registry.Date.Day;
                if (registry.Date.Year == year && registry.Date.Month == month)
                {
                    //try
                    //{
                    //This could throw an exception (index out of bounds)
                    chartData[day - 1] += (registry as QuantityRegistry).Quantity;
                    //}
                    //catch
                    //{
                    // Add data to fix the exception
                    //chartData.Add(0);
                    //i--; //Repeat until it's possible to access to the index
                    //}
                }

            }

            //Cumulative sum of the data
            //for (int i = 1; i < chartData.Count; i++)
            for (int i = 1; i < chartData.Length; i++)
            {
                chartData[i] += chartData[i - 1];
            }

            //return chartData.ToArray();
            return chartData;
        }

        public double[] CalculateChartDataYearWeek(ICollection<Registry> registries, int year, int week)
        {
            throw new NotImplementedException();
        }
    }
}
