import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(private authService: AuthService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        event => {
          // do nothing when success
        },
        error => {
          if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.endsWith('/login')) {
            this.authService.redirectToLogin(null);
          }
        }
      )
    );
  }
}
