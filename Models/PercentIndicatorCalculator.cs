using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public class PercentIndicatorCalculator : IIndicatorCalculator
    {
        public double Calculate(ICollection<Registry> registries)
        {
            double sum = 0;
            double quantity = 0;
            foreach (Registry registry in registries) {
                if(registry is PercentRegistry)
                {
                    sum += (registry as PercentRegistry).Percent;
                    quantity++;
                }
                else
                    throw new TypeAccessException("PercentIndicatorCalculator can't work over this type of registry");
            }
            if(quantity > 0) {
                return sum / quantity;
            }
            else {
                return 0;
            }
        }

        public double Calculate(ICollection<Registry> registries, int year)
        {
            double sum = 0;
            double quantity = 0;
            foreach (Registry registry in registries) {
                if(registry is PercentRegistry && registry.Date.Year == year) {
                    sum += (registry as PercentRegistry).Percent;
                    quantity++;
                }
                else
                    throw new TypeAccessException("PercentIndicatorCalculator can't work over this type of registry");
            }
            if(quantity > 0) {
                return sum / quantity;
            }
            else {
                return 0;
            }
        }

        public double Calculate(ICollection<Registry> registries, int year, int month)
        {
            double sum = 0;
            double quantity = 0;
            foreach (Registry registry in registries) {
                if(registry is PercentRegistry && registry.Date.Year == year && registry.Date.Month == month) {
                    sum += (registry as PercentRegistry).Percent;
                    quantity++;
                }
                else
                    throw new TypeAccessException("PercentIndicatorCalculator can't work over this type of registry");
            }
            if(quantity > 0) {
                return sum / quantity;
            }
            else {
                return 0;
            }
        }

        public double[] CalculateChartData(ICollection<Registry> registries)
        {
            List<double> chartData = new List<double>();
            List<double> quantity = new List<double>();
            //Count the registries for every month of every year
            for (int i = 0; i < registries.Count; i++)
            {
                Registry registry = registries.ElementAt(i);
                int year = registry.Date.Year;
                int month = registry.Date.Month;
                try
                {
                    //This could throw an exception (index out of bounds)
                    chartData[(year - 2018 * 12) + month - 1] += (registry as PercentRegistry).Percent;
                    quantity[(year - 2018 * 12) + month - 1]++;
                }
                catch
                {
                    // Add data to fix the exception
                    chartData.Add(0);
                    quantity.Add(0);
                    i--; //Repeat until it's possible to access to the index
                }
            }

            //Cumulative sum of the data
            for (int i = 1; i < chartData.Count; i++)
            {
                chartData[i] += chartData[i - 1];
                quantity[i] += quantity[i - 1];
            }

            //Average
            for (int i = 0; i < chartData.Count; i++)
            {
                chartData[i] /= quantity[i];
            }

            return chartData.ToArray();
        }

        public double[] CalculateChartDataYear(ICollection<Registry> registries, int year)
        {
            //List<double> chartData = new List<double>();
            double[] chartData = new double[12];
            //List<double> quantity = new List<double>();
            double[] quantity = new double[12];

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
                    chartData[month - 1] += (registry as PercentRegistry).Percent;
                    quantity[month - 1]++;
                    //}
                    //catch
                    //{
                    // Add data to fix the exception
                    //chartData.Add(0);
                    //quantity.Add(0);
                    //i--; //Repeat until it's possible to access to the index
                    //}
                }

            }

            //Cumulative sum of the data
            //for (int i = 1; i < chartData.Count; i++)
            for (int i = 1; i < chartData.Length; i++)
            {
                chartData[i] += chartData[i - 1];
                quantity[i] += quantity[i - 1];
            }

            //Average
            //for (int i = 0; i < chartData.Count; i++)
            for (int i = 0; i < chartData.Length; i++)
            {
                chartData[i] /= quantity[i];
            }

            //return chartData.ToArray();
            return chartData;
        }

        public double[] CalculateChartDataYearMonth(ICollection<Registry> registries, int year, int month)
        {
            //List<double> chartData = new List<double>();
            int daysInMonth = DateTime.DaysInMonth(year, month);
            double[] chartData = new double[daysInMonth];
            //List<double> quantity = new List<double>();
            double[] quantity = new double[daysInMonth];

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
                    chartData[day - 1] += (registry as PercentRegistry).Percent;
                    quantity[day - 1]++;
                    //}
                    //catch
                    //{
                    // Add data to fix the exception
                    //chartData.Add(0);
                    //quantity.Add(0);
                    //i--; //Repeat until it's possible to access to the index
                    //}
                }

            }

            //Cumulative sum of the data
            //for (int i = 1; i < chartData.Count; i++)
            for (int i = 1; i < chartData.Length; i++)
            {
                chartData[i] += chartData[i - 1];
                quantity[i] += quantity[i - 1];
            }

            //Average
            //for (int i = 0; i < chartData.Count; i++)
            for (int i = 0; i < chartData.Length; i++)
            {
                chartData[i] /= quantity[i];
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
