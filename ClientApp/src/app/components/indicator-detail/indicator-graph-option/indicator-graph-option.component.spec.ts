import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGraphOptionComponent } from './indicator-graph-option.component';

describe('IndicatorGraphOptionComponent', () => {
  let component: IndicatorGraphOptionComponent;
  let fixture: ComponentFixture<IndicatorGraphOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorGraphOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorGraphOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
