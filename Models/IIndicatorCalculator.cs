using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public interface IIndicatorCalculator
    {
        double Calculate(ICollection<Registry> registries);
        double CalculateYear(ICollection<Registry> registries, int year);
        double CalculateYearTrimester(ICollection<Registry> registries, int year, int trimester);
        double CalculateYearMonth(ICollection<Registry> registries, int year, int month);
        double CalculateWeek(ICollection<Registry> registries, int startWeekYear, int startWeekMonth, int startWeekDay);

        double CalculateGoal(ICollection<Goal> goals);
        double CalculateGoalWeek(ICollection<Goal> goals, int startWeekYear, int startWeekMonth, int startWeekDay);
        double CalculateGoalDay(Goal goal);

        double[] Cumulative(double[] values);
        double[] CumulativeGoals(double[] values);
    }
}
