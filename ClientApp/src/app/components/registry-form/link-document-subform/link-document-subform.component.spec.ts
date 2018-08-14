import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDocumentSubformComponent } from './link-document-subform.component';

describe('LinkDocumentSubformComponent', () => {
  let component: LinkDocumentSubformComponent;
  let fixture: ComponentFixture<LinkDocumentSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkDocumentSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDocumentSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
