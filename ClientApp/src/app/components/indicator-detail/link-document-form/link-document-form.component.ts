import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

//Models
import { Registry } from '../../../shared/models/registry';
import { Document } from '../../../shared/models/document';

//Services
import { RegistryService } from '../../../services/registry/registry.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-link-document-form',
  templateUrl: './link-document-form.component.html',
  styleUrls: ['./link-document-form.component.css']
})
export class LinkDocumentFormComponent implements OnInit {

  model: Document;
  @Input() modalRef: BsModalRef;
  @Input() idRegistry;
  @Input() registry: Registry;

  onSubmit() {
    this.model.extension = "link";
    this.RegistryService.addLinkDocument(this.model, this.idRegistry).subscribe(
      (data) =>{
        data.forEach(element => {
          this.registry.documents.push(element);
        });
        this.closeModal();
    });
    
  }

  showFormControls(form: any) {
    return form && form.controls['name'] &&
      form.controls['name'].value; // Dr. IQ
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  constructor(private router: Router,
              private RegistryService: RegistryService,
              private modalService: BsModalService) {
    this.model = new Document();
    this.model.name = "";
    this.model.link = "";
  }

  ngOnInit() {
  }

}
