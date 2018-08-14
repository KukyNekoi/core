import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentFormComponent } from './add-document-form.component';

describe('AddDocumentFormComponent', () => {
  let component: AddDocumentFormComponent;
  let fixture: ComponentFixture<AddDocumentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocumentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
