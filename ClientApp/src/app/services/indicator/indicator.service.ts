import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Angular models from shared
import { Indicator } from '../../shared/models/indicator';
import { Registry } from '../../shared/models/registry';
import { Goal } from '../../shared/models/goal';

// Services
import { DateService } from '../date/date.service';

@Injectable()
export class IndicatorService {

  public static BASE_URL = 'api/Indicators';

  public static INDICATORS_API = '/api/Indicators/';
  public static GOALSLIST = '/GoalsList';
  public static GOAL = '/Goal';
  public static CALCULATE_API = '/api/Indicators/Calculate/';
  public static REGISTRIES_API = '/api/Registries/';
  public static PERCENT_REGISTRY = '/PercentRegistry';
  public static QUANTITY_REGISTRY = '/QuantityRegistry';
  public static DEFAULT_REGISTRY = '/DefaultRegistry/';
  public static REGISTRY_NAME_VERIFICATION = '/RegistryNameExists';
  public static GOALS = '/Goals/';
  public static GOALS_LIST = '/GoalsList/';
  public static CALCULATE = '/Calculate/';
  public static CALCULATE_CHART = IndicatorService.CALCULATE + 'Chart/';
  public static GOALS_CHART = IndicatorService.GOALS + 'Chart/';
  public static YEAR = 'Year/';
  public static TRIMESTER = '/Trimester/';
  public static MONTH = '/Month/';
  public static WEEK = 'Week/';

  constructor(public http: HttpClient, private dateService: DateService) { }

  getIndicator(indicatorId: number): Observable<Indicator> {
    return this.http.get<Indicator>(IndicatorService.INDICATORS_API + indicatorId);
  }

  getIndicators(): Observable<Indicator[]> {
    return this.http.get<Indicator[]>(IndicatorService.INDICATORS_API);
  }

  getIndicatorYear(indicatorId: number, year: number): Observable<Indicator> {
    return this.http.get<Indicator>(IndicatorService.INDICATORS_API + indicatorId + '/' + IndicatorService.YEAR + year);
  }

  getIndicatorYearTrimester(indicatorId: number, year: number, trimester: number): Observable<Indicator> {
    return this.http.get<Indicator>(IndicatorService.INDICATORS_API + indicatorId +
      '/' + IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  getIndicatorYearMonth(indicatorId: number, year: number, month: number): Observable<Indicator> {
    return this.http.get<Indicator>(IndicatorService.INDICATORS_API + indicatorId +
      '/' + IndicatorService.YEAR + year + IndicatorService.MONTH + month);
  }

  getIndicatorYearWeek(indicatorId: number, year: number, week: number): Observable<Indicator> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<Indicator>(IndicatorService.INDICATORS_API + indicatorId +
      '/' + IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  calculateSpecificIndicator(indicatorId: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE);
  }

  calculateSpecificIndicatorYear(indicatorId: number, year: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE +
      IndicatorService.YEAR + year);
  }

  calculateSpecificIndicatorYearTrimester(indicatorId: number, year: number, trimester: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE +
      IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  calculateSpecificIndicatorYearMonth(indicatorId: number, year: number, month: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE +
      IndicatorService.YEAR + year + IndicatorService.MONTH + month);
  }

  calculateSpecificIndicatorYearWeek(indicatorId: number, year: number, week: number): Observable<number> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE +
      IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  getGoal(indicatorId: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS);
  }

  getGoalYear(indicatorId: number, year: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS +
      IndicatorService.YEAR + year);
  }

  getGoalYearTrimester(indicatorId: number, year: number, trimester: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS +
      IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  getGoalYearMonth(indicatorId: number, year: number, month: number): Observable<number> {
    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS +
      IndicatorService.YEAR + year + IndicatorService.MONTH + month);
  }

  getGoalYearWeek(indicatorId: number, year: number, week: number): Observable<number> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS +
      IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  calculateAllIndicators(): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.CALCULATE_API);
  }

  calculateAllIndicatorsYear(year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.CALCULATE_API + IndicatorService.YEAR + year);
  }

  calculateAllIndicatorsYearTrimester(year: number, trimester: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.CALCULATE_API +
    IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  calculateAllIndicatorsYearMonth(year: number, month: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.CALCULATE_API +
      IndicatorService.YEAR + year + IndicatorService.MONTH + month);
  }

  calculateAllIndicatorsYearWeek(year: number, week: number): Observable<number[]> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorService.CALCULATE_API +
      IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  calculateIndicatorChart(indicatorId: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE_CHART);
  }

  calculateIndicatorYearChart(indicatorId: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE_CHART +
      IndicatorService.YEAR + year);
  }

  calculateIndicatorYearTrimesterChart(indicatorId: number, year: number, trimester: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE_CHART +
      IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  calculateIndicatorYearMonthChart(indicatorId: number, year: number, month: number): Observable<number[]> {
    const week = this.dateService.getWeekISO8601(new Date(year, month, 1));
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE_CHART +
      IndicatorService.YEAR + year + IndicatorService.MONTH + month +
      '/From/' + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  calculateIndicatorYearWeekChart(indicatorId: number, year: number, week: number): Observable<number[]> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.CALCULATE_CHART +
      IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  getGoalChart(indicatorId: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS_CHART);
  }

  getGoalYearChart(indicatorId: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS_CHART +
      IndicatorService.YEAR + year);
  }

  getGoalYearTrimesterChart(indicatorId: number, year: number, trimester: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS_CHART +
      IndicatorService.YEAR + year + IndicatorService.TRIMESTER + trimester);
  }

  getGoalYearMonthChart(indicatorId: number, year: number, month: number): Observable<number[]> {
    const week = this.dateService.getWeekISO8601(new Date(year, month, 1));
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS_CHART +
      IndicatorService.YEAR + year + IndicatorService.MONTH + month + '/From/' + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  getGoalYearWeekChart(indicatorId: number, year: number, week: number): Observable<number[]> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALS_CHART +
      IndicatorService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  addRegistry(registry: Registry, indicatorId: String, registriesType: string): Observable<Registry> {
    let discriminator: string = IndicatorService.DEFAULT_REGISTRY;
    if (registriesType === 'QuantityRegistry') {
        discriminator = IndicatorService.QUANTITY_REGISTRY;
    } else if (registriesType === 'PercentRegistry') {
        discriminator = IndicatorService.PERCENT_REGISTRY;
    }
    return this.http.post<Registry>(IndicatorService.REGISTRIES_API + indicatorId
        + discriminator, registry);
  }

  deleteRegistry(registry: Registry): Observable<Registry> {
    return this.http.delete<Registry>(IndicatorService.REGISTRIES_API + registry.registryID);
  }

  getGoalsList(indicatorId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALSLIST);
  }

  postGoals(indicatorId: number, goals: Goal[]): Observable<Goal[]> {
    return this.http.post<Goal[]>(IndicatorService.INDICATORS_API + indicatorId + IndicatorService.GOALSLIST, goals);
  }

  putGoal(goal: Goal) {
    this.http.put(IndicatorService.INDICATORS_API + goal.goalID + IndicatorService.GOAL, goal).subscribe();
  }

  addIndicator(indicator: Indicator): Observable<any> {
    return this.http.post<any>(IndicatorService.INDICATORS_API, indicator);
  }

  deleteIndicator(indicator: Indicator): Observable<Indicator> {
    return this.http.delete<Indicator>(IndicatorService.INDICATORS_API + indicator.indicatorID);
  }

  editIndicator(indicator: Indicator): Observable<Indicator> {
    return this.http.put<Indicator>(IndicatorService.INDICATORS_API + indicator.indicatorID, indicator);
  }
}
