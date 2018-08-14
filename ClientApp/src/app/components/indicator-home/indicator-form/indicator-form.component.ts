import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";

// Models
import { Indicator } from '../../../shared/models/indicator';
import {RegistryType} from '../../../shared/models/registryType';
import { RolesType } from '../../../shared/models/rolesType';

// Services
import { IndicatorService} from '../../../services/indicator/indicator.service';
import { RoleService } from '../../../services/role/role.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-indicator-form',
  templateUrl: './indicator-form.component.html',
  styleUrls: ['./indicator-form.component.css']
})
export class IndicatorFormComponent implements OnInit {

  @Input() modalRef: BsModalRef;

  @Input() idIndicatorGroup: number;

  @Output()
  private udpateEvent = new EventEmitter();

  public model: Indicator = new Indicator();
  public selectedIndicatorTypeText = "Tipo de registros";

  public types;

  // If you don't like those names, change them yourself
  // adm always can read or write
  // ger always can read
  // encOp always can read and can write, but not every indicator
  // anOp always can read, but can't write by default
  read: any = { adm: true, ger: true, encOp: true, anOp: true,
    ejVta: false, nvoNeg: false, ctrlSeg: false, exSr: false, exJr: false, prdta: false};

  write: any = { adm: true, ger: false, encOp: false, anOp: false,
    ejVta: false, nvoNeg: false, ctrlSeg: false, exSr: false, exJr: false, prdta: false};

  constructor(private modalService: BsModalService,
              private service: IndicatorService,
              private roleService: RoleService) { }

  ngOnInit() {
    this.types = ["Registros simples",
                  "Registros de cantidad",
                  "Registros de porcentajes"];
    this.selectedIndicatorTypeText = this.types[0];
  }

  updateDropdown(value: string) {
    this.selectedIndicatorTypeText = value;
  }

  hideModal() {
    this.modalRef.hide();
  }

  onSubmit() {

    this.model.indicatorGroupID = this.idIndicatorGroup;

    if(this.selectedIndicatorTypeText == this.types[0]) {
      this.model.registriesType = 0;
    }
    else if(this.selectedIndicatorTypeText == this.types[1]) {
      this.model.registriesType = 1;
    }
    else if (this.selectedIndicatorTypeText == this.types[2]) {
      this.model.registriesType = 2;
    }

    this.service.addIndicator(this.model).subscribe(
      data => {
        if (data as boolean == false) {
          this.duplicateNameAlert();
          return;
        }
        else {
          for (let i in this.read) {
            if (this.read[i] === true) {
              this.roleService.addPermissionRead(RolesType[i], (data as Indicator), true).subscribe();
              if (this.write[i] === true) { // read and/or write permissions
                this.roleService.addPermissionWrite(RolesType[i], (data as Indicator), true).subscribe();
              }
            }
          }
          this.udpateEvent.emit("Indicator Added");
        }
      }
    );
    this.hideModal();
  }

  private duplicateNameAlert()
  {
    swal({
      title: 'Error al agregar el grupo de indicadores',
      //text: 'Ya existe un registro con el nombre ' + this.model.name,
      html: '<h6> Ya existe un indicador con el nombre "' + this.model.name + '"</h6>',
      type: 'warning',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
}
