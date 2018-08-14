import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDocumentSubformComponent } from './file-document-subform.component';

describe('FileDocumentSubformComponent', () => {
  let component: FileDocumentSubformComponent;
  let fixture: ComponentFixture<FileDocumentSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDocumentSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDocumentSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
