import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Models
import { Months } from '../../shared/models/months';
import { Trimesters } from '../../shared/models/trimesters';

// Services
import { SessionService } from '../../services/session/session.service';
import { DateService } from '../../services/date/date.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
})

export class DateFilterComponent implements OnInit {
  private static ALL_YEARS = 'Todos los años';
  private static YEAR_PREFIX = 'Año '; // Part of the string that the DropDown has to show as selected
  private static BASE_YEAR = 2018;
  private static SELECT_DEFAULT_TEXT = 'Seleccione...';
  private static SELECT_DEFAULT = -1;

  // Static attributes avalaible for the html template
  allYears = DateFilterComponent.ALL_YEARS;
  yearPrefix = DateFilterComponent.YEAR_PREFIX;
  selectDefaultText = DateFilterComponent.SELECT_DEFAULT_TEXT;
  selectDefault = DateFilterComponent.SELECT_DEFAULT;

  // Dropdown labels
  dropdownYearLabel = 'Año:';
  dropdownTrimesterLabel = 'Trimestre:';
  dropdownMonthLabel = 'Mes:';
  dropdownWeekLabel = 'Semana:';

  // Flags to enable/disable dropdowns
  isSpecificYearSelected = false;
  isSpecificTrimesterSelected = false;
  isSpecificMonthSelected = false;
  isSpecificWeekSelected = false;

  // Data dropdown year
  dropdownYearText: string; // Dropdown year, ex: "Año 2018"
  selectedYear: number; // Numeric value for selectionYear
  years: number[] = []; // List of years from 2018 to CurrentYear

  // Data dropdown trimester
  dropdownTrimesterText: string;
  selectedTrimester: number;
  trimesters: number[] = [];
  dropdownTrimestersList: string[] = [];

  // Data dropdown month
  dropdownMonthText: string = DateFilterComponent.SELECT_DEFAULT_TEXT; // Default selection (string shown in the dropdown)
  selectedMonth: number; // The current selected month (number), depends of the name of the month in spanish.
  months: number[] = []; // List of the months from 0 (January) to the current month (defined in ngOnInit)
  dropdownMonthsList: string[] = []; // List with the names of the months (in spanish) of the selected year (defined in ngOnInit)

  // Data dropdown week
  dropdownWeekText: string = DateFilterComponent.SELECT_DEFAULT_TEXT;
  selectedWeek: number;
  weeks: number[] = [];
  dropdownWeeksList: string[] = [];

  // Enums avalaible for the HTML template
  Trimesters = Trimesters;
  Months = Months;

  @Output() dropdownChange = new EventEmitter();

  constructor(private sessionService: SessionService, private dateService: DateService) {
  }

  ngOnInit() {
    this.getInitialData();
    this.prepareDropdowns();
  }

  // Get the data from the session service, if it's not saved, the service returns the default values
  getInitialData() {
    const data = this.sessionService.getDateFiltersData();
    // Dropdown text
    this.dropdownYearText = data.dropdownYearText;
    this.dropdownTrimesterText = data.dropdownTrimesterText;
    this.dropdownMonthText = data.dropdownMonthText;
    this.dropdownWeekText = data.dropdownWeekText;
    // Selected value
    this.selectedYear = data.selectedYear;
    this.selectedTrimester = data.selectedTrimester;
    this.selectedMonth = data.selectedMonth;
    this.selectedWeek = data.selectedWeek;
    // Dropdown flags
    this.isSpecificYearSelected = data.isSpecificYearSelected;
    this.isSpecificTrimesterSelected = data.isSpecificTrimesterSelected;
    this.isSpecificMonthSelected = data.isSpecificMonthSelected;
    this.isSpecificWeekSelected = data.isSpecificWeekSelected;
  }

  prepareDropdowns() {
    this.prepareYearsDropdown();

    if (this.isSpecificYearSelected) {
      this.prepareTrimestersDropdown();
    }
    if (this.isSpecificTrimesterSelected) {
      this.prepareMonthsDropdown();
    }
    if (this.isSpecificMonthSelected) {
      this.prepareWeeksDropdown();
    }
  }

  getCurrentYear(): number {
  return new Date().getFullYear();
  }

  getCurrentMonth(): number {
    return new Date().getMonth();
  }

  getCurrentTrimester(): number {
    return Math.floor((this.getCurrentMonth()) / 3);
  }

  getWeekString(week: number): string {
    const mondayWeek = this.dateService.getDateFromWeek(this.selectedYear, week);
    const sundayWeek = this.dateService.addDays(mondayWeek, 6);
    const mondayWeekString = mondayWeek.getDate() + ' ' + this.dateService.months[mondayWeek.getMonth()].shortName;
    const sundayWeekString = sundayWeek.getDate() + ' ' + this.dateService.months[sundayWeek.getMonth()].shortName;
    return week + ' (' + mondayWeekString + ' a ' + sundayWeekString + ')';
  }

  // The default value is all the years
  selectYear(year: number) {
    if (year === DateFilterComponent.SELECT_DEFAULT) {
      this.selectedAllYears();
    } else if (year >= DateFilterComponent.BASE_YEAR) {
      this.selectedSpecificYear(year);
    } else {
      // console.log('El año seleccionado es incorrecto');
    }
  }

  // The default value is none
  selectTrimester(trimester: number) {
    if (trimester === DateFilterComponent.SELECT_DEFAULT) {
      this.selectedDefaultTrimester();
    } else if (trimester >= 0 && trimester <= 3) {
      this.selectedSpecificTrimester(trimester);
    } else {
      // console.log('El trimestre seleccionado es incorrecto');
    }
  }

  // The default value is none
  selectMonth(month: number) {
    if (month === DateFilterComponent.SELECT_DEFAULT) {
      this.selectedDefaultMonth();
    } else if (month >= 0 && month <= 11) {
      this.selectedSpecificMonth(month);
    } else {
      // console.log('El mes seleccionado es incorrecto');
    }
  }

  // The default value is none
  selectWeek(week: number) {
    if (week === DateFilterComponent.SELECT_DEFAULT) {
      this.selectedDefaultWeek();
    } else if (week >= 0 && week <= this.dateService.getWeeksInYearISO8601(this.selectedYear)) {
      this.selectedSpecificWeek(week);
    } else {
      // console.log('La semana seleccionada es incorrecta');
    }
  }

  selectedAllYears() {
    this.setAllYears();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedSpecificYear(year: number) {
    this.setSpecificYear(year);
    this.prepareTrimestersDropdown();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedDefaultTrimester() {
    this.setDefaultTrimester();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedSpecificTrimester(trimester: number) {
    this.setSpecificTrimester(trimester);
    this.prepareMonthsDropdown();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedDefaultMonth() {
    this.setDefaultMonth();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedSpecificMonth(month: number) {
    this.setSpecificMonth(month);
    this.prepareWeeksDropdown();
    this.resetChildDropdowns();
    this.dropdownChanged();
  }

  selectedDefaultWeek() {
    this.setDefaultWeek();
    this.dropdownChanged();
  }

  selectedSpecificWeek(week: number) {
    this.setSpecificWeek(week);
    this.dropdownChanged();
  }

  setAllYears() {
    this.isSpecificYearSelected = false;
    this.isSpecificTrimesterSelected = false;
    this.isSpecificMonthSelected = false;
    this.isSpecificWeekSelected = false;
    // All years is the default option in the dropdown
    this.dropdownYearText = DateFilterComponent.ALL_YEARS;
    this.selectedYear = DateFilterComponent.SELECT_DEFAULT;
    // Save data in session storage
    this.sessionService.setDropdownYearText(this.dropdownYearText);
    this.sessionService.setSelectedYear(this.selectedYear);
    this.sessionService.setDropdownTrimesterText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedTrimester(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownMonthText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedMonth(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setSpecificYear(year: number) {
    this.isSpecificYearSelected = true;
    this.isSpecificTrimesterSelected = false;
    this.isSpecificMonthSelected = false;
    this.isSpecificWeekSelected = false;
    this.dropdownYearText = DateFilterComponent.YEAR_PREFIX + year;
    this.selectedYear = year;
    // Save data in session storage
    this.sessionService.setDropdownYearText(this.dropdownYearText);
    this.sessionService.setSelectedYear(this.selectedYear);
    this.sessionService.setDropdownTrimesterText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedTrimester(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownMonthText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedMonth(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setDefaultTrimester() {
    this.isSpecificTrimesterSelected = false;
    this.isSpecificMonthSelected = false;
    this.isSpecificWeekSelected = false;
    this.dropdownTrimesterText = DateFilterComponent.SELECT_DEFAULT_TEXT;
    this.selectedTrimester = DateFilterComponent.SELECT_DEFAULT;
    // Save data in session storage
    this.sessionService.setDropdownTrimesterText(this.dropdownTrimesterText);
    this.sessionService.setSelectedTrimester(this.selectedTrimester);
    this.sessionService.setDropdownMonthText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedMonth(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setSpecificTrimester(trimester: number) {
    this.isSpecificTrimesterSelected = true;
    this.isSpecificMonthSelected = false;
    this.isSpecificWeekSelected = false;
    this.dropdownTrimesterText = Trimesters[trimester];
    this.selectedTrimester = trimester;
    // Save data in session storage
    this.sessionService.setDropdownTrimesterText(this.dropdownTrimesterText);
    this.sessionService.setSelectedTrimester(this.selectedTrimester);
    this.sessionService.setDropdownMonthText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedMonth(DateFilterComponent.SELECT_DEFAULT);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setDefaultMonth() {
    this.isSpecificMonthSelected = false;
    this.isSpecificWeekSelected = false;
    this.dropdownMonthText = DateFilterComponent.SELECT_DEFAULT_TEXT;
    this.selectedMonth = DateFilterComponent.SELECT_DEFAULT;
    // Save data in session storage
    this.sessionService.setDropdownMonthText(this.dropdownMonthText);
    this.sessionService.setSelectedMonth(this.selectedMonth);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setSpecificMonth(month: number) {
    this.isSpecificMonthSelected = true;
    this.isSpecificWeekSelected = false;
    this.dropdownMonthText = Months[month];
    this.selectedMonth = month;
    // Save data in session storage
    this.sessionService.setDropdownMonthText(this.dropdownMonthText);
    this.sessionService.setSelectedMonth(this.selectedMonth);
    this.sessionService.setDropdownWeekText(DateFilterComponent.SELECT_DEFAULT_TEXT);
    this.sessionService.setSelectedWeek(DateFilterComponent.SELECT_DEFAULT);
  }

  setDefaultWeek() {
    this.isSpecificWeekSelected = false;
    this.dropdownWeekText = DateFilterComponent.SELECT_DEFAULT_TEXT;
    this.selectedWeek = DateFilterComponent.SELECT_DEFAULT;
    // Save data in session storage
    this.sessionService.setDropdownWeekText(this.dropdownWeekText);
    this.sessionService.setSelectedWeek(this.selectedWeek);
  }

  setSpecificWeek(week: number) {
    this.isSpecificWeekSelected = true;
    this.dropdownWeekText = this.getWeekString(week);
    this.selectedWeek = week;
    // Save data in session storage
    this.sessionService.setDropdownWeekText(this.dropdownWeekText);
    this.sessionService.setSelectedWeek(this.selectedWeek);
  }

  prepareYearsDropdown() {
    const currentYear = this.getCurrentYear();
    const baseYear = DateFilterComponent.BASE_YEAR;
    for (let i = 0; i <= currentYear - baseYear; i++) {
      this.years[i] = baseYear + i;
    }
  }

  // set names to all four trimester of the year
  prepareTrimestersDropdown() {
    const currentYear = this.getCurrentYear();
    if (this.selectedYear < currentYear) {
      this.setTrimesterUntil(3); // October-December
    } else {
      const currentTrimester = this.getCurrentTrimester();
      this.setTrimesterUntil(currentTrimester);
    }
    this.setDropdownTrimesterList();
  }

  // until: Trimester number from 0 (January-March) to 3 (October-December)
  setTrimesterUntil(until: number) {
    this.trimesters = [];
    for (let i = 0; i <= until; i++) {
      this.trimesters[i] = i;
    }
  }

  setDropdownTrimesterList() {
    this.dropdownTrimestersList = [];
    this.trimesters.forEach(trimester => {
      this.dropdownTrimestersList[trimester] = Trimesters[trimester];
    });
  }

  // Set the list of the months (numbers) from 0 to the current month (max 11)
  // The months depends on the selected trimester (this.selectedTrimester) and year (this.selectedYear)
  prepareMonthsDropdown() {
    const currentYear = this.getCurrentYear();
    const currentMonth = this.getCurrentMonth();
    const from = (this.selectedTrimester + 1) * 3 - 3;
    const until = from + 2;
    if (this.selectedYear < currentYear) {  // Previous year
      this.setMonthsFromUntil(from, until);
    } else {  // Current year
      if (currentMonth < until) {
        this.setMonthsFromUntil(from, currentMonth);
      } else {
        this.setMonthsFromUntil(from, until);
      }
    }
    this.setDropdownMonthsList();
  }

  // from: Month number from 0 (January) to 11 (December)
  // until: Month number from 0 (January) to 11 (December), greater or equal than from
  setMonthsFromUntil(from: number, until: number) {
    this.months = [];
    for (let i = from; i <= until; i++) {
      this.months[i - from] = i;
    }
  }

  setDropdownMonthsList() {
    this.dropdownMonthsList = [];
    this.months.forEach(month => {
      this.dropdownMonthsList[month] = Months[month];
    });
  }

  prepareWeeksDropdown() {
    const currentYear = this.getCurrentYear();
    const currentWeek = this.dateService.getWeekISO8601(new Date());

    const from = this.dateService.getWeekISO8601(new Date(this.selectedYear, this.selectedMonth, 1));
    let dateUntil = new Date(this.selectedYear, this.selectedMonth + 1, 1); // If the month = 12, it passes to the next year
    dateUntil = this.dateService.addDays(dateUntil, -1);
    const until = this.dateService.getWeekISO8601(dateUntil);

    if (this.selectedYear < currentYear) { // Previous year
      this.setWeeksFromUntil(from, until);

    } else { // Current year
      if (currentWeek < until) {
        this.setWeeksFromUntil(from, currentWeek);

      } else {
        this.setWeeksFromUntil(from, until);
      }
    }
  }

  // from: Week number from 0 to 51 or 52 (depends of the year)
  // until: Week number from 0 to 51 or 52 (depends of the year), greater or equal than from
  setWeeksFromUntil(from: number, until: number) {
    this.weeks = [];
    for (let i = from; i <= until; i++) {
      this.weeks[i - from] = i;
    }
  }

  resetChildDropdowns() {
    // Verify dropdown selection bottom-up (from week to year)
    if (!this.isSpecificWeekSelected && this.isSpecificMonthSelected) {
      this.resetWeekDropdown();

    } else if (this.isSpecificTrimesterSelected) {
      this.resetWeekDropdown();
      this.resetMonthDropdown();

    } else if (this.isSpecificYearSelected) {
      this.resetWeekDropdown();
      this.resetMonthDropdown();
      this.resetTrimesterDropdown();

    } else {
      this.resetWeekDropdown();
      this.resetMonthDropdown();
      this.resetTrimesterDropdown();
    }
  }

  resetWeekDropdown() {
    this.selectedWeek = DateFilterComponent.SELECT_DEFAULT;
    this.dropdownWeekText = DateFilterComponent.SELECT_DEFAULT_TEXT;
  }

  resetMonthDropdown() {
    this.selectedMonth = DateFilterComponent.SELECT_DEFAULT;
    this.dropdownMonthText = DateFilterComponent.SELECT_DEFAULT_TEXT;
  }

  resetTrimesterDropdown() {
    this.selectedTrimester = DateFilterComponent.SELECT_DEFAULT;
    this.dropdownTrimesterText = DateFilterComponent.SELECT_DEFAULT_TEXT;
  }

  dropdownChanged() {
    this.dropdownChange.emit({
      isSpecificYearSelected: this.isSpecificYearSelected,
      isSpecificTrimesterSelected: this.isSpecificTrimesterSelected,
      isSpecificMonthSelected: this.isSpecificMonthSelected,
      isSpecificWeekSelected: this.isSpecificWeekSelected,
      selectedYear: this.selectedYear,
      selectedTrimester: this.selectedTrimester,
      selectedMonth: this.selectedMonth,
      selectedWeek: this.selectedWeek
    });
  }
}
