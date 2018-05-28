import { Component, OnInit, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';

// Models
import { Indicator } from '../../../shared/models/indicator';

// Service
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';

@Component({
  selector: 'app-indicator-display',
  templateUrl: './indicator-display.component.html',
  styleUrls: ['./indicator-display.component.css']
})
export class IndicatorDisplayComponent implements OnInit {
  private static ALL_YEARS = 'Todos los años';
  private static ALL_MONTHS = 'Todos los meses';
  private static YEAR = 'Año '; // In the front of the selected year (e.g.: 'Año 2018')
  // Used in the html to keep the consistency
  allYears: string = IndicatorDisplayComponent.ALL_YEARS;
  allMonths: string = IndicatorDisplayComponent.ALL_MONTHS;

  @Input() indicatorGroup: IndicatorGroup;
  indicatorResults$: Observable<number[]>;
  selectionYear: string; // Default selection = currentYear (defined in ngOnInit) (string shown in the dropdown)
  // tslint:disable-next-line:max-line-length
  selectionMonth: string = IndicatorDisplayComponent.ALL_MONTHS; // Default selection (string shown in the dropdown)
  selectedYear: number; // The current selected year (number), by default = currentYear (defined in ngOnInit)
  selectedMonth: number; // The current selected month (number), depends of the name of the month in spanish.
  years: number[] = []; // List of the years from baseYear to currentYear (defined in ngOnInit)
  // tslint:disable-next-line:max-line-length
  monthsNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  months: number[] = []; // List of the months from 0 (January) to the current month (defined in ngOnInit)
  monthsOfTheYear: string[] = []; // List with the list names of the months (in spanish) of the selected year (defined in ngOnInit)
  isMonthDisabled = false;  // Set 'true' when ALL_YEARS is selected. In other case, set false.

  constructor(private service: IndicatorGroupService) {
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.indicatorResults$ = this.service.calculateIndicatorGroupYear(this.indicatorGroup.indicatorGroupID, currentYear);

    // Create the list of years from baseYear to currentYear
    const baseYear = 2018; // Year in which this project began
    for (let i = 0; i <= (currentYear - baseYear); i++) {
        this.years[i] = baseYear + i;
    }
    this.selectionYear = IndicatorDisplayComponent.YEAR + currentYear; // By default the current year is shown
    this.selectedYear = currentYear; // The number of the selected year (by default the current year)

    this.setMonths(); // Set the list of the months (numbers) and the monthsOfTheYear (names of the months)
    this.selectionMonth = IndicatorDisplayComponent.ALL_MONTHS; // By default ALL_MONTHS is shown
    this.selectedMonth = -1; // It's not selected a specific month yet
  }

  // Only specify the year or the month, depending on which one is changed, the other value must be an empty string ('')
  calculateIndicators(year: any, month: string) { // The 'year' is of type 'any' because it's used as 'int' and 'string'}
    const currentYear = new Date().getFullYear();
    // The change is in the year
    if ((year as string).length !== 0) {
      // ALL_YEARS selected
      if (year === IndicatorDisplayComponent.ALL_YEARS) {
        this.indicatorResults$ = this.service.calculateIndicatorGroup(this.indicatorGroup.indicatorGroupID); // Calculate for all the years
        this.selectionYear = IndicatorDisplayComponent.ALL_YEARS; // Change the value shown in the dropdown
        this.isMonthDisabled = true;  // Not able to select a month
        this.selectedYear = -1; // Not selected a specific year
      }
      // Selected a specific year
      // tslint:disable-next-line:one-line
      else {
        // tslint:disable-next-line:max-line-length
        this.indicatorResults$ = this.service.calculateIndicatorGroupYear(this.indicatorGroup.indicatorGroupID, year); // Calculate for the specific year
        this.selectionYear = IndicatorDisplayComponent.YEAR + year; // Change the value shown in the dropdown
        this.isMonthDisabled = false; // It's possible to select a month
        this.selectedYear = year;
        this.setMonths();
      }
      this.selectionMonth = IndicatorDisplayComponent.ALL_MONTHS;
    }
    // The change is in the month
    // tslint:disable-next-line:one-line
    else {
      // All the months of the already selected year
      if (month === IndicatorDisplayComponent.ALL_MONTHS) {
        this.selectedMonth = -1; // Not selected a specific month
        // tslint:disable-next-line:max-line-length
        this.indicatorResults$ = this.service.calculateIndicatorGroupYear(this.indicatorGroup.indicatorGroupID, this.selectedYear); // Calculate for the already selected year
        this.selectionMonth = IndicatorDisplayComponent.ALL_MONTHS; // Change the value shown in the dropdown
      }
      // Selected a specific month of the already selected year
      // tslint:disable-next-line:one-line
      else {
        this.setSelectedMonth(month); // Set the numeric value of the month as selected (needed for the calculation)
        // Do the calculation for the already selected year and month
        // tslint:disable-next-line:max-line-length
        this.indicatorResults$ = this.service.calculateIndicatorGroupYearMonth(this.indicatorGroup.indicatorGroupID, this.selectedYear, this.selectedMonth);
        this.selectionMonth = this.monthsNames[this.selectedMonth]; // Change the value shown in the dropdown
      }
    }
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
      this.monthsOfTheYear[month] = this.monthsNames[month];
    });
  }

  // According to the name of a month, it sets the corresponding number to the 'selectedMonth'
  setSelectedMonth(month: string) {
    for (let index = 0; index < this.monthsNames.length; index++) {
      if (month === this.monthsNames[index]) {
        this.selectedMonth = index;
        return;
      }
    }
  }
}
