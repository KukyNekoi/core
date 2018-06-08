import { Component, OnInit, Input, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Registry } from '../../../shared/models/registry';
import { Document } from '../../../shared/models/document';
import { RegistryType } from '../../../shared/models/registryType';
import { RegistryService } from '../../../services/registry/registry.service';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Indicator } from '../../../shared/models/indicator';

@Component({
  selector: 'app-indicator-detail-registry',
  templateUrl: './indicator-detail-registry.component.html',
  styleUrls: ['./indicator-detail-registry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicatorDetailRegistryComponent implements OnInit {

  customClass = 'card-header';

  @Input()
  public indicator: Indicator;


  public registry: Registry = null; // For EditRegistry
  public editModalRef: BsModalRef;

  constructor(private registryService: RegistryService,
    private indicatorService: IndicatorService,
    private modalService: BsModalService) { }

  ngOnInit() {
  }

  private deleteDocument(registry: Registry, document: Document) {
    const result = confirm('Está seguro que desea eliminar el documento: ' + document.name);
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

      const index = registry.documents.indexOf(document);
      if (index !== -1) {
        registry.documents.splice(index, 1);
      }
    }
  }

  openModalEditRegistry($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.registry = selectedRegistry;
    this.editModalRef = this.modalService.show(template);
  }

  private deleteRegistry($event: any, registry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    const date: Date = new Date(registry.date);
    const formatedDate: string = date.getDate() + '-' + (+date.getMonth() + 1) + '-' + date.getFullYear();
    const result = confirm('Está seguro que desea eliminar el registro: \n' + formatedDate + ' - ' + registry.name);

    if (result) {
      this.indicatorService.deleteRegistry(registry).subscribe(
        data => {
          const index = this.indicator.registries.indexOf(registry);
          this.indicator.registries.splice(index, 1);
        },
        err => console.error(err)
      );
    }
  }
}
