import { ActivatedRoute } from '@angular/router';
import { Component, Inject, OnInit, HostBinding, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Model
import { IndicatorGroup } from '../../shared/models/indicatorGroup';
import { RegistryType } from '../../shared/models/registryType';
import {Role} from '../../shared/models/role';
import {RolesType} from '../../shared/models/rolesType';

// Service
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { RegistryService } from '../../services/registry/registry.service';
import { SessionService } from '../../services/session/session.service';
import { AuthService } from '../../services/auth/AuthService';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';



@Component({
  selector: 'app-indicator-home',
  templateUrl: './indicator-home.component.html',
  styleUrls: ['./indicator-home.component.css']
})
export class IndicatorHomeComponent implements OnInit {
  @HostBinding('class') classes = 'wrapper'; // This adds a class to the host container

  public idIndicatorGroup = -1;

  // Observables
  public indicatorGroup$: Observable<IndicatorGroup>;
  indicatorResults$: Observable<number[]>;
  goals$: Observable<number[]>;

  // Date Filter data
  isSpecificYearSelected: boolean;
  isSpecificTrimesterSelected: boolean;
  isSpecificMonthSelected: boolean;
  isSpecificWeekSelected: boolean;
  selectedYear: number;
  selectedTrimester: number;
  selectedMonth: number;
  selectedWeek: number;

  modalRef: BsModalRef;

  constructor(private indicatorGroupService: IndicatorGroupService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private indicatorService: IndicatorGroupService,
              private registryService: RegistryService,
              private sessionService: SessionService,
              private authService: AuthService) {
    this.idIndicatorGroup = this.route.snapshot.params.idIndicatorGroup;
    this.indicatorGroup$ = this.indicatorGroupService.getIndicatorGroup(this.idIndicatorGroup);
  }

  ngOnInit() {
    this.updateExternalIndicator();
    this.updateObservables(this.sessionService.getDateFiltersData());
  }

  updateExternalIndicator() {
    this.indicatorGroup$.subscribe(group => {
      group.indicators.forEach(indicator => {
        if (indicator.registriesType === RegistryType.ExternalRegistry) {
          this.registryService.getRegistriesExternal().subscribe();
        }
      });
    });
  }

  updateObservables(event) {
    this.updateDropdownDateFiltersValues(event);

    // Verify dropdown selection bottom-up (from week to year)
    if (this.isSpecificWeekSelected) {
      this.updateObservablesSpecificWeek();

    } else if (this.isSpecificMonthSelected) {
      this.updateObservablesSpecificMonth();

    } else if (this.isSpecificTrimesterSelected) {
      this.updateObservablesSpecificTrimester();

    } else if (this.isSpecificYearSelected) {
      this.updateObservablesSpecificYear();

    } else {
      this.updateObservablesAllYears();
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
    this.indicatorResults$ = this.indicatorService.calculateIndicatorGroup(this.idIndicatorGroup);
    this.goals$ = this.indicatorService.getGoals(this.idIndicatorGroup);
  }

  updateObservablesSpecificYear() {
    this.indicatorResults$ = this.indicatorService.calculateIndicatorGroupYear(this.idIndicatorGroup, this.selectedYear);
    this.goals$ = this.indicatorService.getGoalsYear(this.idIndicatorGroup, this.selectedYear);
  }

  updateObservablesSpecificTrimester() {
    this.indicatorResults$ = this.indicatorService.calculateIndicatorGroupYearTrimester(this.idIndicatorGroup,
      this.selectedYear, this.selectedTrimester);
    this.goals$ = this.indicatorService
      .getGoalsYearTrimester(this.idIndicatorGroup, this.selectedYear, this.selectedTrimester);
  }

  updateObservablesSpecificMonth() {
    this.indicatorResults$ = this.indicatorService.calculateIndicatorGroupYearMonth(this.idIndicatorGroup,
      this.selectedYear, this.selectedMonth);
    this.goals$ = this.indicatorService.getGoalsYearMonth(this.idIndicatorGroup, this.selectedYear, this.selectedMonth);
  }

  updateObservablesSpecificWeek() {
    this.indicatorResults$ = this.indicatorService.calculateIndicatorGroupYearWeek(this.idIndicatorGroup,
      this.selectedYear, this.selectedWeek);
    this.goals$ = this.indicatorService.getGoalsYearWeek(this.idIndicatorGroup, this.selectedYear, this.selectedWeek);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  indicatorAdded() {
    this.indicatorGroup$ = this.indicatorService.getIndicatorGroup(this.idIndicatorGroup);
    this.updateObservables('');
  }

  get isAdminOrManager(): boolean {
    const token = this.authService.getRole();
    if (token !== undefined && token !== null) {
      return token.roleToken === RolesType['adm'] || token.roleToken === RolesType['ger'];
    }
    return false;
  }

}
