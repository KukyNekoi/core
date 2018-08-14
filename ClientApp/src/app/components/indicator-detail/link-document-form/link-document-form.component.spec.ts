import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDocumentFormComponent } from './link-document-form.component';

describe('LinkDocumentFormComponent', () => {
  let component: LinkDocumentFormComponent;
  let fixture: ComponentFixture<LinkDocumentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkDocumentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
