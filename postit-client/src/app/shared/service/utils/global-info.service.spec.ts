import { TestBed, inject } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { GlobalInfoService } from './global-info.service';
import { TranslateService } from './translate.service';

describe('GlobalInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalInfoService,
        MatSnackBar,
        TranslateService
      ],
      imports: [MatSnackBarModule]
    });
  });

  it('should be created', inject([GlobalInfoService], (service: GlobalInfoService) => {
    expect(service).toBeTruthy();
  }));
});
