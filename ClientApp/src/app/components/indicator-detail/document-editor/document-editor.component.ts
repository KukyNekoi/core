import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Registry } from '../../../shared/models/registry';
import { Indicator } from '../../../shared/models/indicator';
import { FileService } from '../../../services/file/file.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Document } from '../../../shared/models/document';
import { equal, deepEqual, notDeepEqual } from 'assert';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.css'],
})
export class DocumentEditorComponent implements OnInit {

  @Input()
  public document: Document;
  public newDocument: Document;

  @Output()
  private updateEvent = new EventEmitter();

  @Input()
  public documents: Document[];

  @Input()
  public editModalRef: BsModalRef;

  minDate = new Date(2018, 0, 1); // 1 January 2018
  maxDate = new Date(); // Today
  public bsValue;

  constructor(private service: FileService,
    private localeService: BsLocaleService, private datepickerConfig: BsDatepickerConfig) { }

  ngOnInit() {
    this.newDocument= JSON.parse(JSON.stringify(this.document)); // To create a clone of the selected document (this.document)
    this.localeService.use('es'); // Datepicker with spanish locale
    this.datepickerConfig.showWeekNumbers = false; // Don't show the week numbers in the datepicker
    this.fixDate();
  }

  editDocument() {
    try {
      notDeepEqual(this.document, this.newDocument); // If document and newDcoument are not equal, just close the modal
      
        this.service.editDocument(this.newDocument).subscribe(
          data => {

            this.updateEvent.emit("Document modified");
          },
          err => console.error(err)
        );

    }
    catch (error) {

    }

    this.editModalRef.hide();
    // this.document = null;
    this.editModalRef = null;

  }

  // Fix to convert the corrupted date (string for an unknown reason) to Date object
  fixDate() {
    const date = this.newDocument.date.toString();
    this.newDocument.date = new Date(+date.substr(0, 4), +date.substr(5, 2) - 1, +date.substr(8, 2));
  }
}
