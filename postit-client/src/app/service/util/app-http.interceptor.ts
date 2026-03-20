import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { GlobalInfoService } from './global-info.service';
import { AlertType } from '@app/const/alert-type';
import { GlobalConstant } from '@app/const/global-constant';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly globalInfoService = inject(GlobalInfoService);

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.globalInfoService.notifLoader(true);

    return next.handle(request).pipe(
      tap({
        error: (error) => {
          this.handleError(request, error);
        },
        finalize: () => {
          this.globalInfoService.notifLoader(false);
        },
      }),
    );
  }

  private handleError(request: HttpRequest<unknown>, error: unknown) {
    let errMsg;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        if (!request.url.endsWith('/login')) {
          this.authService.redirectToLogin(null);
        }
        this.globalInfoService.showAlert(
          AlertType.WARNING,
          $localize`:@@global.accessUnauthorized:Access Unauthorized. Please sign in.`,
        );
        return;
      } else if (error.status === 403) {
        this.globalInfoService.showAlert(AlertType.DANGER, $localize`:@@global.accessForbidden:Access Forbidden !`);
        return;
      } else if (error.status !== 500 && error.status && error.error.error) {
        this.globalInfoService.showAlert(
          AlertType.DANGER,
          error.error.error + ' : ' + error.error.message,
          GlobalConstant.Display.NOTIFICATION_DELAY * 3,
        );
        return;
      }

      if (error.error.error) {
        // Message from json for server error
        errMsg = error.error.message;
      } else {
        // Message from status
        errMsg = error.status + ' ' + error.message;
      }
    } else {
      // Network error ?
      errMsg = request.url + ' - ' + error;
    }

    this.globalInfoService.showAlert(
      AlertType.DANGER,
      $localize`:@@global.technicalError:Technical Error` + ' : ' + errMsg,
      GlobalConstant.Display.NOTIFICATION_DELAY * 5,
    );
  }
}
