import { TestBed, inject } from '@angular/core/testing';

import { GlobalInfoService } from './global-info.service';

describe('GlobalInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalInfoService]
    });
  });

  it('should be created', inject([GlobalInfoService], (service: GlobalInfoService) => {
    expect(service).toBeTruthy();
  }));
});
