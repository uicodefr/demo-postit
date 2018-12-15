import { TestBed, inject } from '@angular/core/testing';

import { PostitService } from './postit.service';

describe('PostitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostitService]
    });
  });

  it('should be created', inject([PostitService], (service: PostitService) => {
    expect(service).toBeTruthy();
  }));
});
