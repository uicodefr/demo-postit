import { TestBed } from '@angular/core/testing';

import { LikeService } from '@app/service/global/like.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LikeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LikeService, provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('should be created', () => {
    const service: LikeService = TestBed.inject(LikeService);
    expect(service).toBeTruthy();
  });
});
