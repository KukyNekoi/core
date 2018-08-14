import { Component, OnInit, Input, ViewEncapsulation, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Registry } from '../../../shared/models/registry';
import { Document } from '../../../shared/models/document';
import { RegistryType } from '../../../shared/models/registryType';
import { RegistryService } from '../../../services/registry/registry.service';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { FileService } from '../../../services/file/file.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import {Role} from '../../../shared/models/role';
import {RolesType} from '../../../shared/models/rolesType';
import { AuthService } from '../../../services/auth/AuthService';
import { PermissionClaim } from '../../../services/auth/permissions';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-indicator-detail-registry',
  templateUrl: './indicator-detail-registry.component.html',
  styleUrls: ['./indicator-detail-registry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicatorDetailRegistryComponent implements OnInit {

  public RegistryType = RegistryType;

  customClass = 'card-header';

  @Input()
  public indicatorId: number;

  @Input()
  public registries: Registry[];

  @Input()
  public registriesType: number;

  @Output()
  private updateEvent = new EventEmitter();

  public registry: Registry = null; // For EditRegistry
  public editModalRef: BsModalRef;
  public modalRef: BsModalRef; // For Documents

  public document: Document = null; // For EditDocument & DocumentPreview

  constructor(private registryService: RegistryService,
    private indicatorService: IndicatorService,
    private fileService: FileService,
    private modalService: BsModalService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  private deleteDocument(registry: Registry, document: Document) {
    this.confirmDeleteDocument();
    if (registry.documents.length === 1) {
      this.deleteDoumentRestriction();
      return;
    } else {
      // const result = confirm('Está seguro que desea eliminar el documento: ' + document.name);
      this.confirmDeleteDocument().then( (result) => {
        if (result.value) {
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
      });

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

  openModalFileDocument($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.registry = selectedRegistry;
    this.modalRef = this.modalService.show(template);
  }

  openModalLinkDocument($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.registry = selectedRegistry;
    this.modalRef = this.modalService.show(template);
  }

  openModalDocumentPreview($event: any, modal: any, selectedDocument: Document) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.document = selectedDocument;
    this.modalRef = modal;
    modal.show();
  }

  goToLink(link: string) {
    var url = ("https://" + link);

    window.location.href = url;
  }

  goToLinkBlank(link: string) {
    var url = ("https://" + link);
    window.open(url, '_blank');
  }

  download(document: Document) {
    this.fileService.downloadFile(document);
  }

  private deleteRegistry($event: any, registry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    const date: Date = new Date(registry.date);
    const formatedDate: string = date.getDate() + '-' + (+date.getMonth() + 1) + '-' + date.getFullYear();

    this.confirmDeleteRegistry(registry.name, formatedDate).then((result) => {
      if (result.value) {
        this.indicatorService.deleteRegistry(registry).subscribe(
          data => {
            const index = this.registries.indexOf(registry);
            this.registries.splice(index, 1);
            this.updateEvent.emit('Registry Deleted');
          },
          err => console.error(err)
        );

      }
    });

  }

  openModalEditDocument($event: any, template: TemplateRef<any>, selectedDocument: Document) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.document = selectedDocument;
    this.editModalRef = this.modalService.show(template);
  }

  updateData() {
    this.updateEvent.emit('Document modified');
  }

  private deleteDoumentRestriction() {
    swal({
      title: 'No es posible eliminar el documento',
      html: '<h6> Debe existir al menos un documento de respaldo para cada registro</h6>' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'error',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  private confirmDeleteDocument() {
     return swal({
      title: 'Eliminar documento',
      html: '<h6>¿Está seguro que desea eliminar el documento de respaldo?</h6><br>Esta acción no puede ser revertida' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'CANCELAR',
      buttonsStyling: false,
      reverseButtons: true,
      confirmButtonClass: 'btn btn-sm btn-primary',
      cancelButtonClass: 'btn btn-sm btn-clean-2 btn-cancel',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  private confirmDeleteRegistry(name: string, date: string) {
    return swal({
      title: 'Eliminar registro',
      html: '<h6>¿Está seguro que desea eliminar el registro<br>"' + date + ' - ' + name + '"?</h6><br>Esta acción no puede ser revertida' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      reverseButtons: true,
      confirmButtonClass: 'btn btn-sm btn-primary',
      cancelButtonClass: 'btn btn-sm btn-clean-2 btn-cancel',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  get isWriteAllowed(): boolean {
    return this.authService.isAllowedTo(this.indicatorId, PermissionClaim.WRITE);
  }

  get isAdminOrManager(): boolean {
    const token = this.authService.getRole();
    if (token !== undefined && token !== null) {
      return token.roleToken === RolesType['adm'] || token.roleToken === RolesType['ger'];
    }
    return false;
  }

}
