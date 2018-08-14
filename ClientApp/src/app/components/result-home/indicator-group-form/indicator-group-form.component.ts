import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Models
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';

// Services
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-indicator-group-form',
  templateUrl: './indicator-group-form.component.html',
  styleUrls: ['./indicator-group-form.component.css']
})
export class IndicatorGroupFormComponent implements OnInit {

  //modalRef: BsModalRef;
  @Input() modalRef: BsModalRef;

  @Output()
  private updateEvent = new EventEmitter();

  public model: IndicatorGroup = new IndicatorGroup();

  constructor(private modalService: BsModalService,
              private service: IndicatorGroupService) { }

  ngOnInit() {
  }

  hideModal() {
    this.modalRef.hide();
  }

  onSubmit() {
    this.service.addIndicatorGroup(this.model).subscribe(
      data => {
        if(data as boolean == false) { // Not added
          this.duplicateNameAlert();
          return;
        }
        else {
          this.updateEvent.emit('Indicator Group Added');
        }
      }
    );
    this.hideModal();
    //this.updateEvent.emit('Indicator Group Added');
  }

  private duplicateNameAlert()
  {
    swal({
      title: 'Error al agregar el grupo de indicadores',
      //text: 'Ya existe un registro con el nombre ' + this.model.name,
      html: '<h6> Ya existe un grupo de indicadores con el nombre "' + this.model.name + '"</h6>',
      type: 'warning',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
}
