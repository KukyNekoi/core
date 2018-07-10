import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Angular models from shared
import { Indicator } from '../../shared/models/indicator';
import { IndicatorGroup } from '../../shared/models/indicatorGroup';

@Injectable()
export class IndicatorGroupService {

  public static API_URL = 'api/IndicatorGroups/';
  public static CALCULATE = IndicatorGroupService.API_URL + 'Calculate/';
  public static GOALS = IndicatorGroupService.API_URL + 'Goals/';
  public static NAME = IndicatorGroupService.API_URL + 'Name/';

  constructor(public http: HttpClient) { }

  addIndicatorGroup(indicatorGroup: IndicatorGroup): Observable<any> {
    return this.http.post<any>(IndicatorGroupService.API_URL, indicatorGroup);
  }


  getIndicatorGroups(): Observable<IndicatorGroup[]> {
    return this.http.get<IndicatorGroup[]>(IndicatorGroupService.API_URL);
  }

  getIndicatorGroup(indicatorGroupId: number | string): Observable<IndicatorGroup> {
    return this.http.get<IndicatorGroup>(IndicatorGroupService.API_URL + indicatorGroupId);
  }

  calculateIndicatorGroup(indicatorGroup: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.CALCULATE + indicatorGroup);
  }

  calculateIndicatorGroupYear(indicatorGroup: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.CALCULATE + indicatorGroup + '/' + year);
  }

  calculateIndicatorGroupYearMonth(indicatorGroup: number, year: number, month: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.CALCULATE + indicatorGroup + '/' + year + '/' + month);
  }

  getGoals(indicatorGroupId: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.GOALS + indicatorGroupId);
  }

  getGoalsYear(indicatorGroupId: number, year: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.GOALS + indicatorGroupId + '/' + year);
  }

  getGoalsYearMonth(indicatorGroupId: number, year: number, month: number): Observable<number[]> {
    return this.http.get<number[]>(IndicatorGroupService.GOALS + indicatorGroupId + '/' + year + '/' + month);
  }

  getIndicatorGroupName(indicatorId: number): Observable<string> {
    return this.http.get<string>(IndicatorGroupService.NAME + indicatorId);
  }
}
