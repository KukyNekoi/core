import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

//Models
import { Document } from '../../../shared/models/document';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-document-form',
  templateUrl: './add-document-form.component.html',
  styleUrls: ['./add-document-form.component.css']
})
export class AddDocumentFormComponent implements OnInit {

  linkChecked: boolean = true;

  @Output() linkAdded: EventEmitter<Document> = new EventEmitter<Document>();
  @Output() fileAdded: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Input() modalRef: BsModalRef;

  constructor() { }

  ngOnInit() {
  }

  emitFile(file: File[]){
    this.fileAdded.emit(file);
    this.closeModal();
  }

  emitLink(document: Document){
    this.linkAdded.emit(document);
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
