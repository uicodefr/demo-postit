import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { GlobalConstant } from '@app/const/global-constant';
import { AlertType } from '@app/const/alert-type';

@Injectable({
  providedIn: 'root',
})
export class GlobalInfoService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly _isLoading = signal<boolean>(false);
  public readonly isLoading = this._isLoading.asReadonly();

  public notifLoader(displayLoader: boolean): void {
    this._isLoading.set(displayLoader);
  }

  public showAlert(alertType: AlertType, message: string, duration?: number): void {
    this.snackBar.open(message, $localize`:@@global.close:Close`, {
      duration: duration || GlobalConstant.Display.NOTIFICATION_DELAY,
      panelClass: [this.getAlertClass(alertType)],
    } as MatSnackBarConfig);
  }

  private getAlertClass(alertType: AlertType): string {
    switch (alertType) {
      case AlertType.SUCCESS:
        return 'alertSuccess';
      case AlertType.INFO:
        return 'alertInfo';
      case AlertType.WARNING:
        return 'alertWarning';
      case AlertType.DANGER:
        return 'alertDanger';
      default:
        return 'alertDefault';
    }
  }
}
