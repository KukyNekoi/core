import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorDetailRegistryComponent } from './indicator-detail-registry.component';

describe('IndicatorDetailRegistryComponent', () => {
  let component: IndicatorDetailRegistryComponent;
  let fixture: ComponentFixture<IndicatorDetailRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorDetailRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorDetailRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
