import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions,  } from '@angular/http';
import { HttpClient } from '@angular/common/http';

// Models
import { Indicator } from '../../shared/models/indicator';
import { IndicatorType } from '../../shared/models/indicatorType';
import { Router } from '@angular/router';
import { Registry } from '../../shared/models/registry';
import { Document } from '../../shared/models/document';

// Services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { RegistryService } from '../../services/registry/registry.service';
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
  private static ALL_YEARS = 'Todos los años';
  private static YEAR = 'Año '; // Part of the string that the DropDown has to show as selected

  public indicator$: Observable<Indicator>;
  public indicator: Indicator = new Indicator();
  public idIndicator = 0;
  public registriesCount = 0;
  public registry: Registry = null; // For EditRegistry
  public type: number;

  router: Router;
  modalRef: BsModalRef;
  public editModalRef: BsModalRef;

  // For filtering by years
  allYears: string = IndicatorDetailComponent.ALL_YEARS;
  selectionYear: string; // Dropdow year "Año 2018"
  selectedYear: number; // Numeric value for selectionYear
  years: number[] = []; // List of years from 2018 to CurrentYear

  constructor(private service: IndicatorService,
    router: Router,
    private registryService: RegistryService,
    private route: ActivatedRoute,
    private modalService: BsModalService) {
    this.idIndicator = this.route.snapshot.params.idIndicator;
    this.router = router;
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.getIndicator(this.idIndicator, currentYear);
    const baseYear = 2018;
    for (let i = 0; i <= (currentYear - baseYear); i++) {
      this.years[i] = baseYear + i;
    }
    this.selectionYear = IndicatorDetailComponent.YEAR + currentYear; // Show Año 2018 on dropdown
    this.selectedYear = currentYear; // 2018 (current year) is the selected year
    this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear);
  }

  selectRegistriesYear(year: any) {
    if (year === IndicatorDetailComponent.ALL_YEARS) {
      this.getIndicator(this.idIndicator); // Show all the registries
      this.selectionYear = IndicatorDetailComponent.ALL_YEARS;
      this.selectedYear = -1;
    }
    else {
      this.getIndicator(this.idIndicator, year); // Show registries from the year selected
      this.selectionYear = IndicatorDetailComponent.YEAR + year; // Change the text on the dropdown
      this.selectedYear = year;
    }
  }

  openModalEditRegistry(template: TemplateRef<any>, selectedRegistry: Registry) {
    this.registry = selectedRegistry;
    this.type = this.indicator.type;
    this.editModalRef = this.modalService.show(template);
  }

  private getIndicator(indicatorId: number, year?: number) {
    if (!year) {
      this.service.getIndicator(indicatorId).subscribe(
        data => {
          this.indicator = data;
          this.registriesCount = data.registries.length;
        },
        err => console.error(err)
      );
    }
    else {
      this.service.getIndicatorYearRegistries(indicatorId, year).subscribe(
        data => {
          this.indicator.registries = data.registries;
          this.registriesCount = data.registries.length;
        },
        err => console.error(err));
    }

  }



  private deleteRegistry (registry: Registry) {
    const date: Date = new Date(registry.date);
    const formatedDate: string = date.getDate() + '-' + (+date.getMonth() + 1) + '-' + date.getFullYear();
    const result = confirm('Está seguro que desea eliminar el registro: \n' + formatedDate + ' - ' + registry.name);

    if (result) {
      let removed: Registry;
      this.service.deleteRegistry(registry.registryID).subscribe(
        data => {
          removed = data;
          this.registriesCount--; },
        err => console.error(err)
      );

      const index: number = this.indicator.registries.indexOf(registry);
      if ( index !== -1) {
        this.indicator.registries.splice(index, 1);
      }
    }
  }

  deleteDocument(registry: Registry, document: Document) {
    const result = confirm('Está seguro que desea elimianr el documento: ' + document.documentName);
    if (registry.documents.length === 1) {
      alert('Debe existir al menos un documento de respaldo para el registro');
      return;
    }
    if (result) {
      let removed: Document;
      this.registryService.deleteDocument(document).subscribe(
        data => {
          removed = data;
        },
        err => console.error(err)
      );

      const index: number = registry.documents.indexOf(document);
      if (index !== -1) {
        registry.documents.splice(index, 1);
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  gotoAddRegistry() {
    this.router.navigateByUrl('/indicator-add-registry');
  }

  gotoRegistry(registryID: number) {
    this.router.navigateByUrl('/registry/' + registryID);
  }
}

