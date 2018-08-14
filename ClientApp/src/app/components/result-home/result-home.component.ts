import { Component, OnInit, HostBinding, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

// Model
import { IndicatorGroup } from '../../shared/models/indicatorGroup';
import {Role} from '../../shared/models/role';
import {RolesType} from '../../shared/models/rolesType';

// Service
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { AuthService } from '../../services/auth/AuthService';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Importa libreria PDF
import * as jsPDF from 'jspdf';
import { TemplateAst } from '@angular/compiler';

@Component(
{
  selector: 'app-result-home',
  templateUrl: './result-home.component.html',
  styleUrls: ['./result-home.component.css']
})
export class ResultHomeComponent implements OnInit {

  @HostBinding('class') classes = 'wrapper'; // This adds a class to the host container

  public indicatorGroups$: Observable<IndicatorGroup[]>;
  public indicatorGroupsComplete$: Observable<IndicatorGroup[]>;

  modalRef: BsModalRef;

  constructor(
    private service: IndicatorGroupService,
    private modalService: BsModalService,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.indicatorGroups$ = this.service.getIndicatorGroups();
    this.indicatorGroupsComplete$ = this.service.getIndicatorGroupsComplete(); 
  }


  openModal(template: TemplateRef<any>)
  {
    this.modalRef = this.modalService.show(template);
  }

  indicatorGroupAdded() {
    this.indicatorGroups$ = this.service.getIndicatorGroups();
  }

  get isAdminOrManager(): boolean {
    const token = this.authService.getRole();
    if (token !== undefined && token !== null) {
      return token.roleToken === RolesType['adm'] || token.roleToken === RolesType['ger'];
    }
    return false;
  }

}
