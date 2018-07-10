import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Models
import { IndicatorGroup } from '../../../shared/models/indicatorGroup';

// Services
import { IndicatorGroupService } from '../../../services/indicator-group/indicator-group.service';


@Component({
  selector: 'app-indicator-group-form',
  templateUrl: './indicator-group-form.component.html',
  styleUrls: ['./indicator-group-form.component.css']
})
export class IndicatorGroupFormComponent implements OnInit {

  // modalRef: BsModalRef;
  @Input() modalRef: BsModalRef;

  @Output() updateEvent = new EventEmitter<any>();

  public model: IndicatorGroup = new IndicatorGroup();

  constructor(private modalService: BsModalService, private service: IndicatorGroupService, private router: Router) { }

  ngOnInit() {
  }

  hideModal() {
    this.modalRef.hide();
  }

  submit() {
    this.service.addIndicatorGroup(this.model).subscribe((data) => {
      this.model = data; // Update IndicatorGroupID...
      console.log('emit');
      // this.router.onSameUrlNavigation = "reload";
      // this.router.navigateByUrl("/home");
      // this.indicatorGroups$ = this.service.getIndicatorGroups();
      // console.log(this.model);
      this.hideModal();
    });
    this.updateEvent.emit('');
  }
}
