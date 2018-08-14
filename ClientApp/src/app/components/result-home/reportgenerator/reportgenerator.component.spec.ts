import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportgeneratorComponent } from './reportgenerator.component';

describe('ReportgeneratorComponent', () => {
  let component: ReportgeneratorComponent;
  let fixture: ComponentFixture<ReportgeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportgeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
