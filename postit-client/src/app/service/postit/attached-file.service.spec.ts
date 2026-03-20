import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AttachedFileService } from '@app/service/postit/attached-file.service';

describe('AttachedFileService', () => {
  let service: AttachedFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachedFileService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AttachedFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
