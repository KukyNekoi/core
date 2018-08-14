import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsEditorComponent } from './goals-editor.component';

describe('GoalsEditorComponent', () => {
  let component: GoalsEditorComponent;
  let fixture: ComponentFixture<GoalsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
