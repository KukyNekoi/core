import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

//Models
import { Document } from '../../../shared/models/document';

//Services
import { FileService } from '../../../services/file/file.service';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {

  pdfSource;
  _document: Document;
  @Input()
  get document(): Document {
    return this._document;
  }
  set document(value: Document){
    this._document = value;
    if (!value) this.loading = true;
  }
  @Input() modalRef: BsModalRef;

  loading: boolean = true;

  constructor(private http: HttpClient,
              private fileService: FileService) {
  }

  ngOnInit() {
  }
}
