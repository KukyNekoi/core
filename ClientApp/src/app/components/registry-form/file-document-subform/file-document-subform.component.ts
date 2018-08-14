import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { Document } from '../../../shared/models/document';

@Component({
  selector: 'app-file-document-subform',
  templateUrl: '../../indicator-detail/file-document-form/file-document-form.component.html',
  styleUrls: ['./file-document-subform.component.css']
})
export class FileDocumentSubformComponent implements OnInit {

  model: Document;
  @Output() docAdded: EventEmitter<File[]> = new EventEmitter<File[]>();

  constructor() {
    this.model = new Document();
    this.model.name = "Nombre";}

  ngOnInit() {
  }

  upload(file: File[]){
    this.docAdded.emit(file);
  }
}
