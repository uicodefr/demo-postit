import { TestBed } from '@angular/core/testing';

import { GlobalInfo } from './global-info';

describe('GlobalInfo', () => {
  let service: GlobalInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
