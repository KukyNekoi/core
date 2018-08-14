import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable()
export class SessionService {

  static SELECTED_YEAR_KEY = 'selectedYear';
  static DROPDOWN_YEAR_TEXT_KEY = 'dropdownYearText';
  static SELECTED_TRIMESTER_KEY = 'selectedTrimester';
  static DROPDOWN_TRIMESTER_TEXT_KEY = 'dropdownTrimesterText';
  static SELECTED_MONTH_KEY = 'selectedMonth';
  static DROPDOWN_MONTH_TEXT_KEY = 'dropdownMonthText';
  static SELECTED_WEEK_KEY = 'selectedWeek';
  static DROPDOWN_WEEK_TEXT_KEY = 'dropdownWeekText';

  static ALL_YEARS = 'Todos los años';
  static SELECT_DEFAULT_TEXT = 'Seleccione...';
  static SELECT_DEFAULT = -1;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

  public isSelectedYearSaved(): boolean {
    return this.storage.has(SessionService.SELECTED_YEAR_KEY);
  }

  public isDropdownYearTextSaved(): boolean {
    return this.storage.has(SessionService.DROPDOWN_YEAR_TEXT_KEY);
  }

  public isSelectedTrimesterSaved(): boolean {
    return this.storage.has(SessionService.SELECTED_TRIMESTER_KEY);
  }

  public isDropdownTrimesterTextSaved(): boolean {
    return this.storage.has(SessionService.DROPDOWN_TRIMESTER_TEXT_KEY);
  }

  public isSelectedMonthSaved(): boolean {
    return this.storage.has(SessionService.SELECTED_MONTH_KEY);
  }

  public isDropdownMonthTextSaved(): boolean {
    return this.storage.has(SessionService.DROPDOWN_MONTH_TEXT_KEY);
  }

  public isSelectedWeekSaved(): boolean {
    return this.storage.has(SessionService.SELECTED_WEEK_KEY);
  }

  public isDropdownWeekTextSaved(): boolean {
    return this.storage.has(SessionService.DROPDOWN_WEEK_TEXT_KEY);
  }

  public getSelectedYear(defaultSelectedYear: number): number {
    if (this.isSelectedYearSaved()) {
      return this.storage.get(SessionService.SELECTED_YEAR_KEY);
    } else {
      this.storage.set(SessionService.SELECTED_YEAR_KEY, defaultSelectedYear);
      return defaultSelectedYear;
    }
  }

  public getDropdownYearText(defaultDropdownYearText: string): string {
    if (this.isDropdownYearTextSaved()) {
      return this.storage.get(SessionService.DROPDOWN_YEAR_TEXT_KEY);
    } else {
      this.storage.set(SessionService.DROPDOWN_YEAR_TEXT_KEY, defaultDropdownYearText);
      return defaultDropdownYearText;
    }
  }

  public getSelectedTrimester(defaultSelectedTrimester: number): number {
    if (this.isSelectedTrimesterSaved()) {
      return this.storage.get(SessionService.SELECTED_TRIMESTER_KEY);
    } else {
      this.storage.set(SessionService.SELECTED_TRIMESTER_KEY, defaultSelectedTrimester);
      return defaultSelectedTrimester;
    }
  }

  public getDropdownTrimesterText(defaultDropdownTrimesterText: string): string {
    if (this.isDropdownTrimesterTextSaved()) {
      return this.storage.get(SessionService.DROPDOWN_TRIMESTER_TEXT_KEY);
    } else {
      this.storage.set(SessionService.DROPDOWN_TRIMESTER_TEXT_KEY, defaultDropdownTrimesterText);
      return defaultDropdownTrimesterText;
    }
  }

  public getSelectedMonth(defaultSelectedMonth: number): number {
    if (this.isSelectedMonthSaved()) {
      return this.storage.get(SessionService.SELECTED_MONTH_KEY);
    } else {
      this.storage.set(SessionService.SELECTED_MONTH_KEY, defaultSelectedMonth);
      return defaultSelectedMonth;
    }
  }

  public getDropdownMonthText(defaultDropdownMonthText: string): string {
    if (this.isDropdownMonthTextSaved()) {
      return this.storage.get(SessionService.DROPDOWN_MONTH_TEXT_KEY);
    } else {
      this.storage.set(SessionService.DROPDOWN_MONTH_TEXT_KEY, defaultDropdownMonthText);
      return defaultDropdownMonthText;
    }
  }

  public getSelectedWeek(defaultSelectedWeek: number): number {
    if (this.isSelectedWeekSaved()) {
      return this.storage.get(SessionService.SELECTED_WEEK_KEY);
    } else {
      this.storage.set(SessionService.SELECTED_WEEK_KEY, defaultSelectedWeek);
      return defaultSelectedWeek;
    }
  }

  public getDropdownWeekText(defaultDropdownWeekText: string): string {
    if (this.isDropdownWeekTextSaved()) {
      return this.storage.get(SessionService.DROPDOWN_WEEK_TEXT_KEY);
    } else {
      this.storage.set(SessionService.DROPDOWN_WEEK_TEXT_KEY, defaultDropdownWeekText);
      return defaultDropdownWeekText;
    }
  }

  public setSelectedYear(selectedYear: number) {
    this.storage.set(SessionService.SELECTED_YEAR_KEY, selectedYear);
  }

  public setDropdownYearText(dropdownYearText: string) {
    this.storage.set(SessionService.DROPDOWN_YEAR_TEXT_KEY, dropdownYearText);
  }

  public setSelectedTrimester(selectedTrimester: number) {
    this.storage.set(SessionService.SELECTED_TRIMESTER_KEY, selectedTrimester);
  }

  public setDropdownTrimesterText(dropdownTrimesterText: string) {
    this.storage.set(SessionService.DROPDOWN_TRIMESTER_TEXT_KEY, dropdownTrimesterText);
  }

  public setSelectedMonth(selectedMonth: number) {
    this.storage.set(SessionService.SELECTED_MONTH_KEY, selectedMonth);
  }

  public setDropdownMonthText(dropdownMonthText: string) {
    this.storage.set(SessionService.DROPDOWN_MONTH_TEXT_KEY, dropdownMonthText);
  }

  public setSelectedWeek(selectedWeek: number) {
    this.storage.set(SessionService.SELECTED_WEEK_KEY, selectedWeek);
  }

  public setDropdownWeekText(dropdownWeekText: string) {
    this.storage.set(SessionService.DROPDOWN_WEEK_TEXT_KEY, dropdownWeekText);
  }

  public getDateFiltersData() {
    return {
      // Dropdown text
      dropdownYearText: this.getDropdownYearText(SessionService.ALL_YEARS),
      dropdownTrimesterText: this.getDropdownTrimesterText(SessionService.SELECT_DEFAULT_TEXT),
      dropdownMonthText: this.getDropdownMonthText(SessionService.SELECT_DEFAULT_TEXT),
      dropdownWeekText: this.getDropdownWeekText(SessionService.SELECT_DEFAULT_TEXT),
      // Selected value
      selectedYear: this.getSelectedYear(SessionService.SELECT_DEFAULT),
      selectedTrimester: this.getSelectedTrimester(SessionService.SELECT_DEFAULT),
      selectedMonth: this.getSelectedMonth(SessionService.SELECT_DEFAULT),
      selectedWeek: this.getSelectedWeek(SessionService.SELECT_DEFAULT),
      // Dropdown flags
      isSpecificYearSelected: (SessionService.SELECT_DEFAULT !== this.getSelectedYear(SessionService.SELECT_DEFAULT)),
      isSpecificTrimesterSelected: (SessionService.SELECT_DEFAULT !== this.getSelectedTrimester(SessionService.SELECT_DEFAULT)),
      isSpecificMonthSelected: (SessionService.SELECT_DEFAULT !== this.getSelectedMonth(SessionService.SELECT_DEFAULT)),
      isSpecificWeekSelected: (SessionService.SELECT_DEFAULT !== this.getSelectedWeek(SessionService.SELECT_DEFAULT)),
    };
  }
}
