import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { GlobalInfoService } from './global-info.service';
import { AlertType } from 'src/app/const/alert-type';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  public constructor(private authService: AuthService, private globalInfoService: GlobalInfoService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.globalInfoService.notifLoader(true);

    return next.handle(request).pipe(
      tap(
        event => {
          // do nothing when success
          this.globalInfoService.notifLoader(false);
        },
        error => {
          this.globalInfoService.notifLoader(false);
          let errMsg = request.url + ' - ';

          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              if (!request.url.endsWith('/login')) {
                this.authService.redirectToLogin(null);
              }

              this.globalInfoService.showAlert(
                AlertType.WARNING,
                $localize`:@@global.accessUnauthorized:Access Unauthorized. Please sign in.`
              );
              return;
            } else if (error.status === 403) {
              this.globalInfoService.showAlert(
                AlertType.DANGER,
                $localize`:@@global.accessForbidden:Access Forbidden !`
              );
              return;
            }
            errMsg = errMsg + error.status + ' ' + error.statusText;
          } else {
            errMsg = errMsg + error;
          }

          this.globalInfoService.showAlert(
            AlertType.DANGER,
            $localize`:@@global.technicalError:Technical Error` + ' : ' + errMsg
          );
        }
      )
    );
  }
}
