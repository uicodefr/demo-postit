import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AlertType } from '../../const/alert-type';
import { GlobalConstant } from '../../const/global-constant';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalInfoService implements OnInit, OnDestroy {

  private loaderSubject = new Subject<boolean>();
  private loaderObservable = this.loaderSubject.asObservable();

  public constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this.loaderSubject.unsubscribe();
  }

  public getLoaderObservable(): Observable<boolean> {
    return this.loaderObservable;
  }

  public notifLoader(displayLoader: boolean) {
    this.loaderSubject.next(displayLoader);
  }

  public showAlert(alertType: AlertType, message: string, duration?: number) {
    this.snackBar.open(message, this.translateService.get('Close'), {
      duration: duration ? duration : GlobalConstant.Display.NOTIFICATION_DELAY,
      panelClass: [this.getAlertClass(alertType)]
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
