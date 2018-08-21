import {Component, OnInit, TemplateRef, Input, Output, EventEmitter} from '@angular/core';
import { Indicator } from '../../shared/models/indicator';
import { IndicatorService } from '../../services/indicator/indicator.service';
import { Registry } from '../../shared/models/registry';
import { RegistryType } from '../../shared/models/registryType';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistryService } from '../../services/registry/registry.service';
import { Document } from '../../shared/models/document';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-registry-form',
  templateUrl: './registry-form.component.html',
  styleUrls: ['./registry-form.component.css']
})
export class RegistryFormComponent implements OnInit {

  model: Registry;
  router: Router;
  @Input() modalRef: BsModalRef;
  @Input() idIndicator;
  @Input() indicator: Indicator;
  @Input() bsConfig;
  @Output() added = new EventEmitter();

  submodalRef: BsModalRef;

  // For documents
  fileList: File[][] = new Array();
  documentList: Document[] = new Array();

  addRegistry() {
    // let nameVerification = false;

    this.indicatorService.addRegistry(this.model, this.idIndicator, RegistryType[this.indicator.registriesType]).subscribe((data) => {
      // nameVerification = data; // Will return true if registry was added, and false if it fails because of a duplicated name
      if (data) {
        this.model = data;
        this.indicator.registries.push(this.model);
        this.addDocuments();
      } else {
        this.duplicateNameAlert();
      }
    });
    this.added.emit();
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  constructor(
    router: Router,
    private indicatorService: IndicatorService,
    private modalService: BsModalService,
    private registryService: RegistryService,
  ) {
    this.model = new Registry();
    this.router = router;
  }

  private getIndicator(indicatorId: number) {
    this.indicatorService.getIndicator(indicatorId).subscribe(
      data => { this.indicator = data; },
      err => console.error(err)
    );
  }
  ngOnInit() {
  }

  private duplicateNameAlert() {
    swal({
      title: 'Error al agregar el registro',
      // text: 'Ya existe un registro con el nombre ' + this.model.name,
      html: '<h6> Ya existe un registro con el nombre "' + this.model.name + '"</h6>' +
      '<hr style="margin-top: 15px !important; margin-bottom: 2.5px !important;">',
      type: 'error',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  openAddDocumentModal($event: any, template: TemplateRef<any>) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.submodalRef = this.modalService.show(template);
  }

  addLink(document: Document) {
    this.documentList.push(document);
  }

  addFile(file: File[]) {
    this.fileList.push(file);
  }

  deleteLink(document: Document) {
    this.documentList.splice(this.documentList.indexOf(document), 1);
  }

  deleteFile(file: File[]) {
    this.fileList.splice(this.fileList.indexOf(file), 1);
  }

  addDocuments() {
    this.documentList.forEach(element => {
      this.registryService.addLinkDocument(element, this.model.registryID).subscribe(data => {
        data.forEach(document => {
          this.model.documents.push(document);
        });
      });
    });

    this.fileList.forEach(element => {
      this.registryService.addFileDocument(element, this.model.registryID).subscribe(data => {
        // console.log(data);
      if (data.type === HttpEventType.Response){
        console.log(data.body)
        this.model.documents.push(new Document().fromJSON(data.body)); 
      }
      });
    });
  }
}
