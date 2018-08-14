import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap/modal';

// Models
import { Indicator } from '../../../shared/models/indicator';
import { IndicatorGroup} from '../../../shared/models/indicatorGroup';
import { RolesType } from '../../../shared/models/rolesType';

// Services
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';
import { IndicatorService } from '../../../services/indicator/indicator.service';
import { AuthService } from '../../../services/auth/AuthService';
import { RoleService } from '../../../services/role/role.service';
import { PermissionClaim } from '../../../services/auth/permissions';

import swal from 'sweetalert2';

@Component({
  selector: 'app-indicator-editor',
  templateUrl: './indicator-editor.component.html',
  styleUrls: ['./indicator-editor.component.css']
})
export class IndicatorEditorComponent implements OnInit {

  @Input()
  public indicatorModalRef: BsModalRef;

  @Input()
  public indicator: Indicator;

  @Output()
  updateInfo = new EventEmitter();

  public newIndicator: Indicator;
  public groups: IndicatorGroup[];

  public selectedText = 'Cambiar el resultado esperado al que pertenece';
  public maxLength = 46; // The selectedText gets truncated on maxLength characters
                        // The indicatorGroup name show a few more characters
                        // Why 46? - Count the characters of selectedText

  // If you don't like those names, change them yourself
  read: any = { adm: false, ger: false, encOp: false, anOp: false,
    ejVta: false, nvoNeg: false, ctrlSeg: false, exSr: false, exJr: false, prdta: false};

  write: any = { adm: false, ger: false, encOp: false, anOp: false,
    ejVta: false, nvoNeg: false, ctrlSeg: false, exSr: false, exJr: false, prdta: false};

  constructor(
    private service: IndicatorService,
    private indicatorGroupService: IndicatorGroupService,
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.newIndicator = JSON.parse(JSON.stringify(this.indicator)); // Create a clone of the original Indicator.
    const groupId = this.indicator.indicatorGroupID;

    this.indicatorGroupService.getIndicatorGroups().subscribe(data => {
      this.groups = data;
    });

    const roles = Object.keys(RolesType);
    for (const role of roles) {
      let roleReads: boolean;
      let roleWrites: boolean;

      this.authService.roleIsAllowedTo(RolesType[role] , this.indicator.indicatorID, PermissionClaim.READ).subscribe( data => {
        const loadedRole = data;
        for (const permission of loadedRole.permissionsRead) {
          if (permission.indicatorID === this.indicator.indicatorID) {
            roleReads = true;
            this.read[role] = true;
          }
        }
      });


      this.authService.roleIsAllowedTo(RolesType[role], this.indicator.indicatorID, PermissionClaim.WRITE).subscribe(data => {
        const loadedRole = data;
        for (const permission of loadedRole.permissionsWrite) {
          if (permission.indicatorID === this.indicator.indicatorID) {
            roleWrites = true;
            this.write[role] = true;
          }
        }
      });
    }

  }

  updateSelected(value: string) {
    this.selectedText = value;
  }

  saveChanges() {
    let moved = false;
    for (const ig of this.groups) {
      if (ig.name === this.selectedText) {
        if (ig.indicatorGroupID !== this.newIndicator.indicatorGroupID) { // Moved to another IndicatorGroup
          moved = true;
        }
        this.newIndicator.indicatorGroupID = ig.indicatorGroupID;

      }
    }

    const roles = Object.keys(RolesType);
    for (const role of roles) {
      if (!this.read[role]) { // If the read permission is removed, then remove too the write permission
        this.roleService.addPermissionRead(RolesType[role], this.newIndicator, false).subscribe();
        this.roleService.addPermissionWrite(RolesType[role], this.newIndicator, false).subscribe();
      } else {
        this.roleService.addPermissionRead(RolesType[role], this.newIndicator, this.read[role]).subscribe();
        this.roleService.addPermissionWrite(RolesType[role], this.newIndicator, this.write[role]).subscribe();
      }
    }

    this.service.editIndicator(this.newIndicator).subscribe(data => {
      if (data) {
        if (moved) {
          this.router.navigateByUrl('/indicatorGroup/' + this.newIndicator.indicatorGroupID );
        } else {
          this.updateInfo.emit();
        }
      } else {
        this.duplicateNameAlert();
      }
    });

    this.indicatorModalRef.hide();
  }

  private duplicateNameAlert() {
    swal({
      title: 'Error al editar el indicador',
      html: '<h6> Ya existe un indicador con el nombre "' + this.newIndicator.name + '"</h6>',
      type: 'warning',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  changeEncOp(event: boolean): boolean {
    if (event === false) {
      this.write.encOp = false;
    }
    return event;
  }

  changeAnOp(event: boolean): boolean {
    if (event === false) {
      this.write.anOp = false;
    }
    return event;
  }

  changeEjVta(event: boolean): boolean {
    if (event === false) {
      this.write.ejVta = false;
    }
    return event;
  }

  changeNvoNeg(event: boolean): boolean {
    if (event === false) {
      this.write.nvoNeg = false;
    }
    return event;
  }

  changeCtrlSeg(event: boolean): boolean {
    if (event === false) {
      this.write.ctrlSeg = false;
    }
    return event;
  }

  changeExSr(event: boolean): boolean {
    if (event === false) {
      this.write.exSr = false;
    }
    return event;
  }

  changeExJr(event: boolean): boolean {
    if (event === false) {
      this.write.exJr = false;
    }
    return event;
  }

  changePrdta(event: boolean): boolean {
    if (event === false) {
      this.write.prdta = false;
    }
    return event;
  }

}
