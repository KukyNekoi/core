// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs/observable/timer';

// Models
import { Goal } from '../../../shared/models/goal';
import { Indicator } from '../../../shared/models/indicator';
import { Months } from '../../../shared/models/months';

// Ngx-Bootstrap
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IndicatorService } from '../../../services/indicator/indicator.service';

// SweetAlert2
import swal from 'sweetalert2';

@Component({
  selector: 'app-goals-editor',
  templateUrl: './goals-editor.component.html',
  styleUrls: ['./goals-editor.component.css']
})
export class GoalsEditorComponent implements OnInit {
  public static YEAR_TEXT = 'Año ';
  public static INITIAL_YEAR = 2018;

  // Static values used in the view
  public yearText = GoalsEditorComponent.YEAR_TEXT;
  public initialYear = GoalsEditorComponent.INITIAL_YEAR;

  // Inputs
  @Input() public indicator: Indicator = new Indicator();
  @Input() public modalRef: BsModalRef;
  @Output() updateGoalEvent = new EventEmitter();

  // Dropdown
  public years: number[] = [];
  public selectedYearText: string;
  public selectedYear: number;
  // Enum to be used in the html template
  public Months = Months;
  // Allow use of Math in html template
  public Math = Math;
  // Form
  public form: FormGroup;
  public requiredError = 'Este campo es obligatorio';
  public patternErrorNatural = 'El valor debe ser un número positivo';
  public patternErrorDecimal = 'El valor debe ser un número positivo con hasta 2 decimales';
  // Flags to know if the form has changed
  public isAdded: boolean; // True if the button to add goals is pressed
  public isChanged: boolean; // True if some field of the form is modified

  constructor(private service: IndicatorService,
    private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit() {
    // List of goals sorted by date
    this.indicator.goals = this.getSortedGoals();

    // Initialize the list of years according to the goals array
    this.initYears();

    // The last year is selected by default
    this.setSelectedYear(this.years.length - 1);

    // Set the data initial data of the form
    this.rebuildForm();
  }

  // Adds a new goal, with the same value of the last added goal
  addGoal() {
    // Set as Added
    this.isAdded = true;

    // Copy the last added value to the new value
    const lastIndex = this.monthlyGoals.controls.length - 1;
    const last = this.monthlyGoals.get(lastIndex.toString()).value['month'];

    // Add a new field to the form using the value of the previously added goal
    this.addMonthlyGoal(last);

    // Add a new year when it's necessary (every 12 inputs inserted)
    if ((this.monthlyGoals.length / 12) > this.years.length) {
      this.years.push(this.years.slice(-1).pop() + 1);
    }

    // Set the last year as selected
    this.setSelectedYear(this.years.length - 1);
  }

  // Close the modal, save the changes in the model and the DB and rebuild the form with the new values
  saveChanges() {
    this.modalRef.hide();

    // Save changes
    const goals = this.indicator.goals.slice();
    const newGoals = [];
    for (let i = 0; i < this.monthlyGoals.controls.length; i++) {
      if (this.indicator.goals.length > i) {
        goals[i].value = this.monthlyGoals.get(i.toString()).value['month'];
      } else {
        const newGoal = new Goal();
        newGoal.indicatorID = this.indicator.indicatorID;
        newGoal.value = this.monthlyGoals.get(i.toString()).value['month'];
        newGoal.year = this.initialYear + Math.floor(i / 12);
        newGoal.month = i % 12;
        newGoals.push(newGoal);
      }
    }

    this.service.postGoals(this.indicator.indicatorID, newGoals).subscribe((res) => {
      this.service.postGoals(this.indicator.indicatorID, goals).subscribe((goalsResult) => {
        res.forEach(g => {
          goalsResult.push(g);
        });
        this.indicator.goals = goalsResult;
        this.updateGoalEvent.emit();
      });
    });

    // Call rebuildForm() with a delay to elude the visualization of errors in the form while the modal is closing
    // rebuildForm() uses the already saved values of the indicator's goals
    const source = timer(500);
    source.subscribe(() => this.rebuildForm());
  }

  revertChanges() {
    this.modalRef.hide();

    // Call rebuildForm() with a delay to elude the visualization of errors in the form while the modal is closing
    const source = timer(500);
    source.subscribe(() => this.rebuildForm());
  }

  // If there are changes, it opens a new modal asking if save or revert the changes
  closeModal() {
    this.modalRef.hide();

    if (!this.form.valid) {
      // Error: Form not valid
      this.showErrorModal();
    } else if (this.form.valid && (this.isChanged || this.isAdded)) {
      // Warning: Save or Discard the changes already done
      this.showWarningModal();
    }

  }

  // Set the selectedYear and selectedYearText by the index in the years array
  setSelectedYear(index: number) {
    this.selectedYear = this.years[index];
    this.selectedYearText = GoalsEditorComponent.YEAR_TEXT + this.selectedYear;
  }

  // Set the isChanged flag to true (called in the change of an input of the form)
  setChanged() {
    this.isChanged = true;
  }

  // Initialize the years array using the goals array
  initYears() {
    if (this.indicator.goals.length !== 0) {
      this.indicator.goals.forEach((goal) => {
        if (!this.years.includes(goal.year)) {
          this.years.push(goal.year);
        }
      });
    } else {
      this.years.push(GoalsEditorComponent.INITIAL_YEAR);
    }
  }

  // Returns the goals array (of the indicator) sorted by date
  getSortedGoals(): Goal[] {
    return this.indicator.goals.sort(this.compareByYearMonth);
  }

  // Function to order the goals array by date
  compareByYearMonth(first, second): number {
    if (first.year === second.year && first.month === second.month) {
      return 0;
    }
    if (first.year < second.year) {
      return -1;
    }
    if (first.year === second.year && first.month < second.month) {
      return -1;
    }
    return 1;
  }

  /* ReactiveForm Functions */

  // Create the base form (without data)
  createForm() {
    this.form = this.fb.group({
      monthlyGoals: this.fb.array([])
    });
  }

  // Reset the status of the inputs and set the data based in the goals array
  rebuildForm() {
    this.form.reset({
      monthlyGoals: this.fb.array([])
    });
    this.setMonthlyGoals(this.indicator.goals);
    this.isAdded = false;
    this.isChanged = false;
  }

  // Property to obtain the monthlyGoals FormArray easily
  // Use: this.monthlyGoals
  get monthlyGoals(): FormArray {
    return this.form.get('monthlyGoals') as FormArray;
  }

  // Set the values of the form using an array of goals
  setMonthlyGoals(goals: Goal[]) {
    if (goals.length !== 0) {
      goals.forEach((goal) => {
        this.addMonthlyGoal(goal.value.toString());
      });
    } else {
      this.addMonthlyGoal('');
    }
  }

  // Adds a new field in the form with a value
  addMonthlyGoal(value: string) {
    // If the registries aren't PercentRegistry, it allows natural numbers (including 0)
    if (this.indicator.registriesType !== 2) {
      this.monthlyGoals.push(this.fb.group({
        month: [value, [Validators.required, Validators.pattern('[0-9]{1,}')]]
      }));
    } else { // Else, it allows decimal numbers (with max. 2 decimals)
      this.monthlyGoals.push(this.fb.group({
        month: [value, [Validators.required, Validators.pattern('[0-9]{1,}([\.][0-9]{1,2}){0,1}')]]
      }));
    }
  }

  /* SweetAlert2 Modals */

  showErrorModal() {
    swal({
      title: 'Meta no válida',
      html: '<h6>Una de las metas ingresadas tiene un valor no válido.</h6><br>Los cambios realizados serán revertidos' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'error',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.value) {
        // Discard changes
        this.rebuildForm();
      }
    });
  }

  showWarningModal() {
    swal({
      title: 'Se han realizado cambios',
      html: '<h6>¿Desea deshacer O guardar los cambios realizados?</h6>' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'DESHACER',
      buttonsStyling: false,
      reverseButtons: true,
      confirmButtonClass: 'btn btn-sm btn-primary btn-confirm',
      cancelButtonClass: 'btn btn-sm btn-clean-2 btn-cancel',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.value) {
        this.saveChanges();
      } else {
        // Discard changes
        this.rebuildForm();
      }
    });
  }
}



