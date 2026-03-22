import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertType } from '@app/const/alert-type';

import { GlobalInfoService } from '@app/service/util/global-info.service';

describe('GlobalInfoService', () => {
  let service: GlobalInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalInfoService, MatSnackBar],
      imports: [MatSnackBarModule],
    });

    service = TestBed.inject(GlobalInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show alert', () => {
    const snackBar = TestBed.inject(MatSnackBar);
    const snackBarSpy = vi.spyOn(snackBar, 'open');

    service.showAlert(AlertType.INFO, 'testMessage');
    expect(snackBarSpy).toHaveBeenCalledWith('testMessage', 'Close', {
      duration: 3000,
      panelClass: ['alertInfo'],
    });
  });
});
