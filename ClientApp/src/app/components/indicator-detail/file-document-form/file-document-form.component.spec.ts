import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDocumentFormComponent } from './file-document-form.component';

describe('FileDocumentFormComponent', () => {
  let component: FileDocumentFormComponent;
  let fixture: ComponentFixture<FileDocumentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDocumentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
