import { Component, OnInit, HostBinding,TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

// Model
import { IndicatorGroup } from '../../shared/models/indicatorGroup';

// Service
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

//Importa libreria PDF
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
  
  modalRef: BsModalRef;

  constructor(private service: IndicatorGroupService, private modalService: BsModalService) {
    
  }

  ngOnInit() 
  {
    this.indicatorGroups$ = this.service.getIndicatorGroups();
  }

  openModal(template: TemplateRef<any>) 
  {
    this.modalRef = this.modalService.show(template,  {class: 'modal-lg modal-md'});
  }

  openModalAdd(template: TemplateRef<any>)
  {
    this.modalRef = this.modalService.show(template);
  }

  addIndicatorGroup(event: any) {
    console.log(event);
  }
}
