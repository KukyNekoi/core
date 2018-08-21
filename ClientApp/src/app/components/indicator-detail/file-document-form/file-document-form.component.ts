import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

//Models
import { Registry } from '../../../shared/models/registry';
import { Document } from '../../../shared/models/document';

//Services
import { RegistryService } from '../../../services/registry/registry.service';

@Component({
  selector: 'app-file-document-form',
  templateUrl: './file-document-form.component.html',
  styleUrls: ['./file-document-form.component.css']
})
export class FileDocumentFormComponent implements OnInit {

  model: Document;
  public progress: number;
  public message: string;
  @Input() modalRef: BsModalRef;
  @Input() idRegistry;
  @Input() registry: Registry;
  @Input() bsConfig;

  upload(files) {
    if (files.length === 0)
      return;
    this.RegistryService.addFileDocument(files, this.idRegistry).subscribe(data => {
      console.log(data);
      if (data.type === HttpEventType.Response){
        console.log(data.body)
        this.registry.documents.push(new Document().fromJSON(data.body)); 
      }
    });
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  showFormControls(form: any) {
    return form && form.controls['name'] &&
      form.controls['name'].value; // Dr. IQ
  }

  constructor(private http: HttpClient, 
              private router: Router, 
              private RegistryService: RegistryService,
              private modalService: BsModalService) {
    this.model = new Document();
    this.model.name = "Nombre";
  }

  ngOnInit() {
  }

}
