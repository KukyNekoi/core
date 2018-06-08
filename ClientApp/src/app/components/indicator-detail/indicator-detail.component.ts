import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions,  } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PercentPipe } from '@angular/common';

// Models
import { Document } from '../../shared/models/document';
import { Indicator } from '../../shared/models/indicator';
import { Months } from '../../shared/models/months';
import { Router } from '@angular/router';
import { Registry } from '../../shared/models/registry';

// Services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { RegistryService } from '../../services/registry/registry.service';
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { IndicatorDisplayComponent } from '../indicator-home/indicator-display/indicator-display.component';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-indicator-detail',
  templateUrl: './indicator-detail.component.html',
  styleUrls: ['./indicator-detail.component.css'],
})
export class IndicatorDetailComponent implements OnInit {
  // For filtering by years
  private static ALL_YEARS = 'Todos los años';
  private static YEAR = 'Año '; // Part of the string that the DropDown has to show as selected
  // For filtering by months
  private static ALL_MONTHS = 'Todos los meses';

  private idIndicatorGroup: number;
  public indicatorGroupName$: Observable<string>;

  public idIndicator = -1;

  public indicator$: Observable<Indicator>;
  public goal$: Observable<number>;
  public value$: Observable<number>;
  router: Router;
  modalRef: BsModalRef;

  allYears: string = IndicatorDetailComponent.ALL_YEARS;
  selectedYearText: string; // Dropdown year "Año 2018"
  selectedYear: number; // Numeric value for selectionYear
  years: number[] = []; // List of years from 2018 to CurrentYear

  allMonths: string = IndicatorDetailComponent.ALL_MONTHS;
  selectedMonthText: string = IndicatorDetailComponent.ALL_MONTHS; // Default selection (string shown in the dropdown)
  selectedMonth: number; // The current selected month (number), depends of the name of the month in spanish.
  months: number[] = []; // List of the months from 0 (January) to the current month (defined in ngOnInit)
  monthsOfTheYear: string[] = []; // List with the list names of the months (in spanish) of the selected year (defined in ngOnInit)
  isMonthDisabled = false;  // Set 'true' when ALL_YEARS is selected. In other case, set false.

    // lineChart
    public counter = 0;
    public lineChartData: Array<any> = [
      {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Cantidad de Registros', lineTension: 0}
    ];

    public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
      'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    public lineChartOptions: any = {
      responsive: true,
      elements: {
        point: {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
        }
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      },
      maintainAspectRatio: false
    };
    public lineChartColors: Array<any> = [
      { // grey
        backgroundColor: 'rgba(144,188,36,0.4)',
        borderColor: 'rgba(0,149,58,1)',
        pointBackgroundColor: 'rgba(0,149,58,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: 'rgba(0,149,58,1)',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }

    ];
    public lineChartLegend = true;
    public lineChartType = 'line';


  constructor(private service: IndicatorService,
    router: Router,
    private registryService: RegistryService,
    private indicatorGroupService: IndicatorGroupService,
    private route: ActivatedRoute,
    private modalService: BsModalService) {
    this.idIndicator = this.route.snapshot.params.idIndicator;
    this.idIndicatorGroup = this.route.snapshot.params.idIndicatorGroup;
    this.router = router;
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const baseYear = 2018;
    for (let i = 0; i <= (currentYear - baseYear); i++) {
      this.years[i] = baseYear + i;
    }
    this.selectedYearText = IndicatorDetailComponent.YEAR + currentYear; // Show Año 2018 on dropdown
    this.selectedYear = currentYear; // 2018 (current year) is the selected year

    const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = December
    // List of the months (numbers) from 0 to the current month (max 11)
    for (let i = 0; i <= currentMonth; i++) {
      this.months[i] = i;
    }
    this.setMonthsOfTheYear(); // List of the names of the months, based in the prior list (this.months)
    this.selectedMonthText = IndicatorDetailComponent.ALL_MONTHS; // By default ALL_MONTHS is shown
    this.selectedMonth = -1; // It's not selected a specific month yet
    this.indicatorGroupName$ = this.indicatorGroupService.getIndicatorGroupName(this.idIndicatorGroup);
    this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear);
    // Calculate indicator
    this.value$ = this.service.getIndicatorValueYear(this.idIndicator, this.selectedYear);
    this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
  }

  selectRegistries(year: any, month: string) {

    if ((year as string).length !== 0 ) {
      if (year === IndicatorDetailComponent.ALL_YEARS) {
        this.indicator$ = this.service.getIndicator(this.idIndicator); // Show all the registries
        // Calculate indicator all years
        this.value$ = this.service.getIndicatorValue(this.idIndicator);
        this.goal$ = this.service.getGoal(this.idIndicator); // shows all goals
        this.selectedYearText = IndicatorDetailComponent.ALL_YEARS;
        this.isMonthDisabled = true;  // Not able to select a month
        this.selectedYear = -1;
      }
      // tslint:disable-next-line:one-line
      else {
        this.selectedYearText = IndicatorDetailComponent.YEAR + year; // Change the text on the dropdown
        this.isMonthDisabled = false; // It's possible to select a month
        this.selectedYear = year;
        // tslint:disable-next-line:max-line-length
        this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear); // Show registries from the year selected
        // Calculate Indicator Selected Year
        this.value$ = this.service.getIndicatorValueYear(this.idIndicator, this.selectedYear);
        this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
        this.setMonths();
        }
      this.selectedMonthText = IndicatorDetailComponent.ALL_MONTHS;
    }
    // tslint:disable-next-line:one-line
    else {
      if (month === IndicatorDetailComponent.ALL_MONTHS) {
        this.selectedMonth = -1; // Not selected a specific month
        this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear);
        // Calculate Indicator All MONTHS
        this.value$ = this.service.getIndicatorValueYear(this.idIndicator, this.selectedYear);
        this.selectedMonthText = IndicatorDetailComponent.ALL_MONTHS;
        this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
      }
      // tslint:disable-next-line:one-line
      else{
        this.setSelectedMonth(month);
        this.indicator$ = this.service.getIndicatorYearMonthRegistries(this.idIndicator, this.selectedYear, this.selectedMonth);
        // Calculate Indicator selected MONTH
        this.value$ = this.service.getIndicatorValueYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
        this.goal$ = this.service.getGoalYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
        this.selectedMonthText = Months[this.selectedMonth]; // Change the value shown in the dropdown
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  gotoAddRegistry() {
    this.router.navigateByUrl('/indicator-add-registry');
  }

  gotoRegistry() {
    this.router.navigateByUrl('/registry-details/' + 1); // Reemplazar por ID, sacado del button
  }

  // Set the list of the months (numbers) from 0 to the current month (max 11)
  // The months depends on the selected year (this.selectedYear)
  setMonths() {
    const currentYear = new Date().getFullYear();
    if (this.selectedYear < currentYear) {
      this.months = [];
      for (let i = 0; i <= 11; i++) { // Months from January (0) to December (11)
        this.months[i] = i;
      }
    }
    // tslint:disable-next-line:one-line
    else {
      this.months = [];
      console.log(this.months);
      const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = Decembery
      for (let i = 0; i <= currentMonth; i++) {
        this.months[i] = i;
      }
    }
    this.setMonthsOfTheYear();
  }

  // Sets the names of the months of the selected year
  setMonthsOfTheYear() {
    this.monthsOfTheYear = [];
    this.months.forEach(month => {
      this.monthsOfTheYear[month] = Months[month];
    });
  }

  // According to the name of a month, it sets the corresponding number to the 'selectedMonth'
  setSelectedMonth(month: string) {
    this.selectedMonth = Months[month];
  }

  public showGraph() {
    if (this.counter % 200 === 0) {
      const _lineChartData: Array<any> = new Array(this.lineChartData.length);

      for (let i = 0; i < this.lineChartData.length; i++) {
        // tslint:disable-next-line:max-line-length
        _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label, lineTension: this.lineChartData[i].lineTension};
        this.indicator$.subscribe(indicator => {
          this.service.getChartDataIndicatorYear(indicator.indicatorID, 2018)
          .subscribe(data => {
            _lineChartData[0].data = data;
            this.lineChartData = _lineChartData;
          });
        });
      }

    }
    this.counter++;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



}

