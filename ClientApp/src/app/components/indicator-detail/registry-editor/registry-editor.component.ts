import { Component, OnInit, Input } from '@angular/core';

import { Registry } from '../../../shared/models/registry';
import { Indicator } from '../../../shared/models/indicator';
import { RegistryService } from '../../../services/registry/registry.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Document } from '../../../shared/models/document';
import { equal, deepEqual, notDeepEqual } from 'assert';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { detachEmbeddedView } from '@angular/core/src/view';

import swal from 'sweetalert2';

@Component({
  selector: 'app-registry-editor',
  templateUrl: './registry-editor.component.html',
  styleUrls: ['./registry-editor.component.css'],
})
export class RegistryEditorComponent implements OnInit {

  @Input()
  public registries: Registry[]; // To automatically update the registries; this.registry = this.newRegistry didn't work

  @Input()
  public registry: Registry;
  public newRegistry: Registry;

  @Input()
  public registriesType: number;

  @Input()
  public editModalRef: BsModalRef;

  minDate = new Date(2018, 0, 1); // 1 January 2018
  maxDate = new Date(); // Today

  public bsValue;

  constructor(private service: RegistryService,
    private localeService: BsLocaleService,
    private datepickerConfig: BsDatepickerConfig) {  }

  ngOnInit() {
    this.localeService.use('es'); // Datepicker with spanish locale
    this.datepickerConfig.showWeekNumbers = false; // Don't show the week numbers in the datepicker
    this.newRegistry = JSON.parse(JSON.stringify(this.registry)); // To create a clone of the selected registry (this.registry)
    this.fixDate();
  }

  editRegistry() {
    try {
      notDeepEqual(this.registry, this.newRegistry); // If registry and newRegistry are not equal, just close the modal
      this.service.editRegistry(this.newRegistry, this.registriesType).subscribe(data =>
      {
        if (data) {
          // replacing the old registry (this.registry) with the edited registry (this.newRegistry)
          const index = this.registries.indexOf(this.registry);
          this.registries[index] = this.newRegistry;
        } else {
          this.duplicateNameAlert();
        }
      });

      // replacing the old registry (this.registry) with the edited registry (this.newRegistry)
      // let index = this.registries.indexOf(this.registry);
      // this.registries[index] = this.newRegistry;

    }
    catch (error) {

    }
    this.editModalRef.hide();
  }

  // Fix to convert the corrupted date (string for an unknown reason) to Date object
  fixDate() {
    const date = this.newRegistry.date.toString();
    this.newRegistry.date = new Date(+date.substr(0, 4), +date.substr(5, 2) - 1, +date.substr(8, 2));
  }

  private duplicateNameAlert() {
    swal({
      title: 'Error al editar el registro',
      html: '<h6> Ya existe un registro con el nombre "' + this.newRegistry.name + '"</h6>',
      type: 'warning',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
}
