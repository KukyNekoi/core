import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGroupEditorComponent } from './indicator-group-editor.component';

describe('IndicatorGroupEditorComponent', () => {
  let component: IndicatorGroupEditorComponent;
  let fixture: ComponentFixture<IndicatorGroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorGroupEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
