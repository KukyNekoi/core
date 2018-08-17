import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGroupFormComponent } from './indicator-group-form.component';

describe('IndicatorGroupFormComponent', () => {
  let component: IndicatorGroupFormComponent;
  let fixture: ComponentFixture<IndicatorGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
