import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Models
import { Document } from '../../shared/models/document';
import { Indicator } from '../../shared/models/indicator';
import { RegistryType } from '../../shared/models/registryType';
import { Months } from '../../shared/models/months';
import {Role} from '../../shared/models/role';
import {RolesType} from '../../shared/models/rolesType';

// Services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { RegistryService } from '../../services/registry/registry.service';
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { SessionService } from '../../services/session/session.service';
import { DateService } from '../../services/date/date.service';
import { AuthService } from '../../services/auth/AuthService';
import { PermissionClaim } from '../../services/auth/permissions';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-indicator-detail',
  templateUrl: './indicator-detail.component.html',
  styleUrls: ['./indicator-detail.component.css'],
})
export class IndicatorDetailComponent implements OnInit {
  modalRef: BsModalRef;
  indicatorModalRef: BsModalRef;

  // Router params
  idIndicatorGroup: number;
  idIndicator: number;

  // Observables
  indicator$: Observable<Indicator>;
  indicatorToEdit: Indicator; // For edit Modal
  goal$: Observable<number>;
  value$: Observable<number>;
  indicatorGroupName$: Observable<string>;

  // Chart Data
  chartGoals$: Observable<number[]>;
  chartValues$: Observable<number[]>;
  chartLabels: string[];

  // Dropdown date filters
  isSpecificYearSelected: boolean;
  isSpecificTrimesterSelected: boolean;
  isSpecificMonthSelected: boolean;
  isSpecificWeekSelected: boolean;
  selectedYear: number;
  selectedTrimester: number;
  selectedMonth: number;
  selectedWeek: number;

  // Allow to use the enum in the html tempalte
  RegistryType = RegistryType;

  // Chart data
  selectedTypeChart: string;
  typesChart: string[] = [];
  typeDispersion: string[] = [];

  // Document data (for EditDocument)
  document: Document = null;

  constructor(private service: IndicatorService,
    private router: Router,
    private registryService: RegistryService,
    private indicatorGroupService: IndicatorGroupService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sessionService: SessionService,
    private dateService: DateService,
    private authService: AuthService
  ) {
    this.idIndicator = this.route.snapshot.params.idIndicator;
    this.idIndicatorGroup = this.route.snapshot.params.idIndicatorGroup;
    this.updateData(this.sessionService.getDateFiltersData());
  }

  ngOnInit() {
    this.updateExternalIndicator();

    this.selectedTypeChart = 'Gráfico de línea'; // default chart type
    this.typesChart = ['Gráfico de barra', 'Gráfico de línea']; // array options chart type
    this.typeDispersion = ['Gráfico de dispersión'];
  }

  updateExternalIndicator() {
    this.indicator$.subscribe((indicator) => {
      if (indicator.registriesType === RegistryType.ExternalRegistry) {
        this.registryService.getRegistriesExternal().subscribe();
      }
    });
  }

  // Called when the dropdown of filters by date changes or the indicator is changed
  updateData(event) {
    this.updateDropdownDateFiltersValues(event);

    // Verify dropdown selection bottom-up (from week to year)
    if (this.isSpecificWeekSelected) {
      this.updateObservablesSpecificWeek();
      this.updateLabelsSpecificWeek();
    } else if (this.isSpecificMonthSelected) {
      this.updateObservablesSpecificMonth();
      this.updateLabelsSpecificMonth();
    } else if (this.isSpecificTrimesterSelected) {
      this.updateObservablesSpecificTrimester();
      this.updateLabelsSpecificTrimester();
    } else if (this.isSpecificYearSelected) {
      this.updateObservablesSpecificYear();
      this.updateLabelsSpecificYear();
    } else {
      this.updateObservablesAllYears();
      this.updateLabelsAllYears();
    }
  }

  updateDropdownDateFiltersValues(event) {
    this.isSpecificYearSelected = event.isSpecificYearSelected;
    this.isSpecificTrimesterSelected = event.isSpecificTrimesterSelected;
    this.isSpecificMonthSelected = event.isSpecificMonthSelected;
    this.isSpecificWeekSelected = event.isSpecificWeekSelected;
    this.selectedYear = event.selectedYear;
    this.selectedTrimester = event.selectedTrimester;
    this.selectedMonth = event.selectedMonth;
    this.selectedWeek = event.selectedWeek;
  }

  updateObservablesAllYears() {
    this.indicator$ = this.service.getIndicator(this.idIndicator);
    this.value$ = this.service.calculateSpecificIndicator(this.idIndicator);
    this.goal$ = this.service.getGoal(this.idIndicator);
    this.chartValues$ = this.service.calculateIndicatorChart(this.idIndicator);
    this.chartGoals$ = this.service.getGoalChart(this.idIndicator);
  }

  updateObservablesSpecificYear() {
    this.indicator$ = this.service.getIndicatorYear(this.idIndicator, this.selectedYear);
    this.value$ = this.service.calculateSpecificIndicatorYear(this.idIndicator, this.selectedYear);
    this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
    this.chartValues$ = this.service.calculateIndicatorYearChart(this.idIndicator, this.selectedYear);
    this.chartGoals$ = this.service.getGoalYearChart(this.idIndicator, this.selectedYear);
  }

  updateObservablesSpecificTrimester() {
    this.indicator$ = this.service.getIndicatorYearTrimester(this.idIndicator, this.selectedYear, this.selectedTrimester);
    this.value$ = this.service.calculateSpecificIndicatorYearTrimester(this.idIndicator, this.selectedYear, this.selectedTrimester);
    this.goal$ = this.service.getGoalYearTrimester(this.idIndicator, this.selectedYear, this.selectedTrimester);
    this.chartValues$ = this.service.calculateIndicatorYearTrimesterChart(this.idIndicator, this.selectedYear, this.selectedTrimester);
    this.chartGoals$ = this.service.getGoalYearTrimesterChart(this.idIndicator, this.selectedYear, this.selectedTrimester);
  }

  updateObservablesSpecificMonth() {
    this.indicator$ = this.service.getIndicatorYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
    this.value$ = this.service.calculateSpecificIndicatorYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
    this.goal$ = this.service.getGoalYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
    this.chartValues$ = this.service.calculateIndicatorYearMonthChart(this.idIndicator, this.selectedYear, this.selectedMonth);
    this.chartGoals$ = this.service.getGoalYearMonthChart(this.idIndicator, this.selectedYear, this.selectedMonth);
  }

  updateObservablesSpecificWeek() {
    this.indicator$ = this.service.getIndicatorYearWeek(this.idIndicator, this.selectedYear, this.selectedWeek);
    this.value$ = this.service.calculateSpecificIndicatorYearWeek(this.idIndicator, this.selectedYear, this.selectedWeek);
    this.goal$ = this.service.getGoalYearWeek(this.idIndicator, this.selectedYear, this.selectedWeek);
    this.chartValues$ = this.service.calculateIndicatorYearWeekChart(this.idIndicator, this.selectedYear, this.selectedWeek);
    this.chartGoals$ = this.service.getGoalYearWeekChart(this.idIndicator, this.selectedYear, this.selectedWeek);
  }

  updateLabelsAllYears() {
    this.chartLabels = [];
    const baseYear = 2018;
    this.chartValues$.subscribe(values => {
      for (let i = 0; i < values.length; i++) {
        this.chartLabels.push((baseYear + i).toString());
      }
    });
  }

  updateLabelsSpecificYear() {
    this.chartLabels = [];
    for (let i = 0; i < 12; i++) {
      this.chartLabels.push(Months[i]);
    }
  }

  updateLabelsSpecificTrimester() {
    this.chartLabels = [];
    const initialMonth = (this.selectedTrimester + 1) * 3 - 3;
    for (let i = 0; i < 3; i++) {
      this.chartLabels.push(Months[initialMonth + i]);
    }
  }

  updateLabelsSpecificMonth() {
    this.chartLabels = [];
    const from = this.dateService.getWeekISO8601(new Date(this.selectedYear, this.selectedMonth, 1));
    let dateUntil = new Date(this.selectedYear, this.selectedMonth + 1, 1); // If the month = 12, it passes to the next year
    dateUntil = this.dateService.addDays(dateUntil, -1);
    const until = this.dateService.getWeekISO8601(dateUntil);
    for (let i = 0; i <= until - from; i++) {
      this.chartLabels.push(this.getWeekString(i + from));
    }
  }

  updateLabelsSpecificWeek() {
    this.chartLabels = [];
    // Monday of the week
    let day = this.dateService.getDateFromWeek(this.selectedYear, this.selectedWeek);
    for (let i = 0 ; i < 7; i++) {
      this.chartLabels.push(day.getDate() + ' ' + this.dateService.months[day.getMonth()].shortName);
      day = this.dateService.addDays(day, 1);
    }
  }

  getWeekString(week: number): string {
    const mondayWeek = this.dateService.getDateFromWeek(this.selectedYear, week);
    const sundayWeek = this.dateService.addDays(mondayWeek, 6);
    const mondayWeekString = mondayWeek.getDate() + ' ' + this.dateService.months[mondayWeek.getMonth()].shortName;
    const sundayWeekString = sundayWeek.getDate() + ' ' + this.dateService.months[sundayWeek.getMonth()].shortName;
    return week + ' (' + mondayWeekString + ' a ' + sundayWeekString + ')';
  }

  selectChart(type: string, indicator: Indicator) {
    if (type === 'Gráfico de barra') {
      this.selectedTypeChart = 'Gráfico de barra'; // change the dropdownlist text
    } else if (type === 'Gráfico de línea') {
      this.selectedTypeChart = 'Gráfico de línea'; // change the dropdownlist text
    } else {
      this.selectedTypeChart = 'Gráfico de dispersión';
    }
  }

  openModalEditDocument(template: TemplateRef<any>, selectedDocument: Document) {
    this.document = selectedDocument;
    this.modalRef = this.modalService.show(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalEditIndicator(template: TemplateRef<any>) {
    this.indicatorModalRef = this.modalService.show(template);
  }

  get isAdminOrManager(): boolean {
    const token = this.authService.getRole();
    if (token !== undefined && token !== null) {
      return token.roleToken === RolesType['adm'] || token.roleToken === RolesType['ger'];
    }
    return false;
  }

  get isWriteAllowed(): boolean {
    return this.authService.isAllowedTo(this.idIndicator, PermissionClaim.WRITE);
  }

}

