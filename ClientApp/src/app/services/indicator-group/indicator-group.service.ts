import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Angular models from shared
import { Indicator } from '../../shared/models/indicator';
import { IndicatorGroup } from '../../shared/models/indicatorGroup';

// Services
import { DateService } from '../date/date.service';

@Injectable()
export class IndicatorGroupService {

  public static API_URL = 'api/IndicatorGroups/';
  public static CALCULATE = '/Calculate';
  public static GOALS = '/Goals';
  public static NAME = '/Name';

  public static YEAR = '/Year/';
  public static TRIMESTER = '/Trimester/';
  public static MONTH = '/Month/';
  public static WEEK = '/Week/';

  public static ALL = 'Complete';

  constructor(public http: HttpClient, private dateService: DateService) { }

  getIndicatorGroupsComplete(): Observable<IndicatorGroup[]> {
    return this.http.get<IndicatorGroup[]>(IndicatorGroupService.API_URL + IndicatorGroupService.ALL);
  }

  getIndicatorGroups(): Observable<IndicatorGroup[]> {
    return this.http.get<IndicatorGroup[]>(IndicatorGroupService.API_URL);
  }

  getIndicatorGroup(indicatorGroupId: number | string): Observable<IndicatorGroup> {
    return this.http.get<IndicatorGroup>(IndicatorGroupService.API_URL + indicatorGroupId);
  }

  calculateIndicatorGroup(indicatorGroupId: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.CALCULATE);
  }

  calculateIndicatorGroupYear(indicatorGroupId: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.CALCULATE
       + IndicatorGroupService.YEAR + year);
  }

  calculateIndicatorGroupYearTrimester(indicatorGroupId: number, year: number, trimester: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.CALCULATE
      + IndicatorGroupService.YEAR + year + IndicatorGroupService.TRIMESTER + trimester);
  }

  calculateIndicatorGroupYearMonth(indicatorGroupId: number, year: number, month: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.CALCULATE
      + IndicatorGroupService.YEAR + year + IndicatorGroupService.MONTH + month);
  }

  calculateIndicatorGroupYearWeek(indicatorGroupId: number, year: number, week: number): Observable<number[]> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.CALCULATE
      + IndicatorGroupService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  getGoals(indicatorGroupId: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.GOALS);
  }

  getGoalsYear(indicatorGroupId: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.GOALS +
      IndicatorGroupService.YEAR + year);
  }

  getGoalsYearTrimester(indicatorGroupId: number, year: number, trimester: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.GOALS +
      IndicatorGroupService.YEAR + year + IndicatorGroupService.TRIMESTER + trimester);
  }

  getGoalsYearMonth(indicatorGroupId: number, year: number, month: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.GOALS +
      IndicatorGroupService.YEAR + year + IndicatorGroupService.MONTH + month);
  }

  getGoalsYearWeek(indicatorGroupId: number, year: number, week: number): Observable<number[]> {
    const startWeekDate = this.dateService.getDateFromWeek(year, week);
    const startWeekYear = startWeekDate.getFullYear();
    const startWeekMonth = startWeekDate.getMonth();
    const startWeekDay = startWeekDate.getDate();

    return this.http.get<number[]>(IndicatorGroupService.API_URL + indicatorGroupId + IndicatorGroupService.GOALS
      + IndicatorGroupService.WEEK + startWeekYear + '/' + startWeekMonth + '/' + startWeekDay);
  }

  getIndicatorGroupName(indicatorId: number): Observable<string> {
    return this.http.get<string>(IndicatorGroupService.API_URL + indicatorId + IndicatorGroupService.NAME);
  }

  addIndicatorGroup(indicatorGroup: IndicatorGroup): Observable<any> {
    return this.http.post<any>(IndicatorGroupService.API_URL, indicatorGroup);
  }

  deleteIndicatorGroup(indicatorGroup: IndicatorGroup): Observable<IndicatorGroup> {
    return this.http.delete<IndicatorGroup>(IndicatorGroupService.API_URL + indicatorGroup.indicatorGroupID);
  }

  editIndicatorGroup(indicatorGroup: IndicatorGroup): Observable<IndicatorGroup> {
    return this.http.put<IndicatorGroup>(IndicatorGroupService.API_URL + indicatorGroup.indicatorGroupID, indicatorGroup);
  }
}
