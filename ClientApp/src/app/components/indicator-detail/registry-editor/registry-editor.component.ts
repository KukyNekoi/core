import { Component, OnInit, Input } from '@angular/core';

import { Registry } from '../../../shared/models/registry';
import { Indicator } from '../../../shared/models/indicator';
import { RegistryService } from '../../../services/registry/registry.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Document } from '../../../shared/models/document';

@Component({
  selector: 'app-registry-editor',
  templateUrl: './registry-editor.component.html',
  styleUrls: ['./registry-editor.component.css'],
})
export class RegistryEditorComponent implements OnInit {

  @Input()
  public registry: Registry;

  @Input()
  public type: number;

  @Input()
  public editModalRef: BsModalRef;

  public bsValue;

  constructor(private service: RegistryService) {  }

  ngOnInit() {  }

  editRegistry() {
    this.service.editRegistry(this.registry, this.type).subscribe();
    this.editModalRef.hide();
    // this.registry = null;
    this.editModalRef = null;
  }

  deleteDocument(document: Document) {
    const result = confirm('Está seguro que desea elimianr el documento: ' + document.documentName);
    if (this.registry.documents.length === 1) {
      alert('Debe existir al menos un documento de respaldo para el registro');
      return;
    }
    if (result) {
      let removed: Document;
      this.service.deleteDocument(document).subscribe(
        data => {
          removed = data;
        },
        err => console.error(err)
      );

      const index: number = this.registry.documents.indexOf(document);
      if (index !== -1) {
        this.registry.documents.splice(index, 1);
      }
    }
  }
}
