import { TestBed, inject } from '@angular/core/testing';

import { PreviousRouteService } from './previous-route.service';

describe('PreviousRouteServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviousRouteService]
    });
  });

  it('should be created', inject([PreviousRouteService], (service: PreviousRouteService) => {
    expect(service).toBeTruthy();
  }));
});
