import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Indicator } from '../../shared/models/indicator';
import { IndicatorService } from '../../services/indicator/indicator.service';
import { Registry } from '../../shared/models/registry';
import { RegistryType } from '../../shared/models/registryType';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  model: Registry = null;
  router: Router;
  @Input() modalRef: BsModalRef;
  @Input() idIndicator;
  @Input() indicator: Indicator;

  onSubmit() {
    let nameVerification = false;

    this.indicatorService.addRegistry(this.model, this.idIndicator, RegistryType[this.indicator.registriesType]).subscribe((data) => {
      nameVerification = data; // Will return true if registry was added, and false if it fails because of a duplicated name
      if (nameVerification) {
        this.indicator.registries.push(this.model);
      } else {
        this.duplicateNameAlert();
      }
    });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  constructor(router: Router, private indicatorService: IndicatorService, private modalService: BsModalService) {
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

  openModalFileDocument($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.model = selectedRegistry;
    this.modalRef = this.modalService.show(template);
  }

  openModalLinkDocument($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.model= selectedRegistry;
    this.modalRef = this.modalService.show(template);
  }

  openModalTypeDocument($event: any, template: TemplateRef<any>, selectedRegistry: Registry) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.model = selectedRegistry;
    this.modalRef = this.modalService.show(template);
  }
}
