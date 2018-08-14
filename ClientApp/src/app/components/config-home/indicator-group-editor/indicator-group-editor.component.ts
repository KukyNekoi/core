import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

// Models
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';

// Services
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';
import {NotificationService} from '../../../services/alerts/notification.service';


import {BsModalRef} from 'ngx-bootstrap';

import swal from 'sweetalert2';

@Component({
  selector: 'app-indicator-group-editor',
  templateUrl: './indicator-group-editor.component.html',
  styleUrls: ['./indicator-group-editor.component.css']
})
export class IndicatorGroupEditorComponent implements OnInit {

  @Input()
  indicatorGroup: IndicatorGroup;

  @Input()
  modalRef: BsModalRef;

  @Output()
  public updateEvent = new EventEmitter();


  public editedIndicatorGroup: IndicatorGroup;

  constructor(private service: IndicatorGroupService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.editedIndicatorGroup = JSON.parse(JSON.stringify(this.indicatorGroup));
  }

  onSubmit() {
    this.service.editIndicatorGroup(this.editedIndicatorGroup).subscribe(data =>{
      if (data) {
        this.notificationService.showToaster('Resultado esperado editado', 'success');
        this.updateEvent.emit('Resultado espero editado');
      } else {
        this.duplicateNameAlert();
      }
    },
      error1 => {
      this.notificationService.showToaster('Error al editar el resultado esperado', 'error');
    });
    this.modalRef.hide();
  }

  private duplicateNameAlert() {
    swal({
      title: 'Error al editar el resultado esperado',
      html: '<h6> Ya existe un resultado esperado con el nombre "' + this.editedIndicatorGroup.name + '"</h6>',
      type: 'warning',
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-sm btn-primary',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }


}
