import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorEditorComponent } from './indicator-editor.component';

describe('IndicatorEditorComponent', () => {
  let component: IndicatorEditorComponent;
  let fixture: ComponentFixture<IndicatorEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
