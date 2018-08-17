import {Component, OnInit, ViewEncapsulation, TemplateRef} from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs/Observable';

import {BsModalRef, BsModalService} from "ngx-bootstrap";

// Models
import { Indicator } from '../../shared/models/indicator';
import { IndicatorGroup } from '../../shared/models/indicatorGroup';
import { RegistryType } from '../../shared/models/registryType';

// services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { NotificationService } from '../../services/alerts/notification.service';
import { AuthService } from '../../services/auth/AuthService';

import { RolesType } from '../../shared/models/rolesType';

import swal from 'sweetalert2';

@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigHomeComponent implements OnInit {

  indicatorsGroups$: Observable<IndicatorGroup[]>;
  public editIndicatorGroupModalRef: BsModalRef;
  public addIndicatorGroupModalRef: BsModalRef;
  public addIndicatorModalRef: BsModalRef;
  public idIndicatorGroup: number;

  public selectedIndicatorGroup: IndicatorGroup;

  public  externalRegistry = RegistryType.ExternalRegistry;

  constructor(private indicatorService: IndicatorService,
              private indicatorGroupService: IndicatorGroupService,
              private notificationService: NotificationService,
              private modalService: BsModalService,
              private authService: AuthService) { }

  ngOnInit() {
    this.indicatorsGroups$ = this.indicatorGroupService.getIndicatorGroups();
  }

  openModalEdit($event: any, template: TemplateRef<any>, indicatorGroup: IndicatorGroup) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    this.selectedIndicatorGroup = indicatorGroup;
    this.editIndicatorGroupModalRef = this.modalService.show(template);
  }

  deleteIndicator($event: any, indicator: Indicator) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    this.confirmDeleteIndicator(indicator.name).then( result => {
      if (result.value) {
        this.indicatorService.deleteIndicator(indicator).subscribe(data =>{
          this.notificationService.showToaster('Indicador eliminado', 'success');
          this.indicatorsGroups$ = this.indicatorGroupService.getIndicatorGroups();
        });
      } else {
        // Do nothing
      }
    }, error =>{
      this.notificationService.showToaster('Error al eliminar el registro', 'error');
    });
  }

  deleteIndicatorGroup($event: any, indicatorGroup: IndicatorGroup) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    this.confirmDeleteIndicatorGroup(indicatorGroup.name).then( result => {
      if (result.value) {
        this.indicatorGroupService.deleteIndicatorGroup(indicatorGroup).subscribe( data => {
          this.notificationService.showToaster('Resultado esperado eliminado', 'success');
          this.indicatorsGroups$ = this.indicatorGroupService.getIndicatorGroups();
        });
      } else {
        // Do nothing
      }
    },error =>{
        this.notificationService.showToaster('Error al eliminar el resultado esperado', 'error');
    });
  }

  public update() {
    this.indicatorsGroups$ = this.indicatorGroupService.getIndicatorGroups();
  }

  private confirmDeleteIndicator(name: string) {
    return swal({
      title: 'Eliminar indicador',
      html: '<h6>¿Está seguro que desea eliminar el indicador <br>"' + name + '"?</h6><br>Esta acción no puede ser revertida y se perderán todos los datos relacionados' +
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

  private confirmDeleteIndicatorGroup(name: string) {
    return swal({
      title: 'Eliminar resultado esperado',
      html: '<h6>¿Está seguro que desea eliminar el resultado<br>"' + name + '"?</h6><br>Esta acción no puede ser revertida y se perderán todos los datos relacionados' +
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

  get isAdminOrManager(): boolean {
    const token = this.authService.getRole();
    if (token !== undefined && token !== null) {
      return token.roleToken === RolesType['adm'] || token.roleToken === RolesType['ger'];
    }
    return false;
  }

  openModal(template: TemplateRef<any>) {
    this.addIndicatorGroupModalRef = this.modalService.show(template);
  }

  openModalIndicator(template: TemplateRef<any>, idIndicatorGroup: number) {
    this.idIndicatorGroup = idIndicatorGroup;
    this.addIndicatorModalRef = this.modalService.show(template);
  }

}
