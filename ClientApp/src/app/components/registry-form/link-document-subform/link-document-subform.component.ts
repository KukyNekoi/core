import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Document } from '../../../shared/models/document';

@Component({
  selector: 'app-link-document-subform',
  templateUrl: '../../indicator-detail/link-document-form/link-document-form.component.html',
  styleUrls: ['./link-document-subform.component.css']
})
export class LinkDocumentSubformComponent implements OnInit {

  @Output() docAdded: EventEmitter<Document> = new EventEmitter<Document>();

  model: Document;

  constructor() { 
    this.model = new Document();
    this.model.name = "";
    this.model.link = "";
  }

  ngOnInit() {
  }

  onSubmit() {
    this.model.extension = "link";
    this.docAdded.emit(this.model);
  }
}
