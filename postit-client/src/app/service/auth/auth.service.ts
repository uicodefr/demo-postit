import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { UserService } from '@app/service/global/user.service';
import { User } from '@app/model/global/user';
import { UrlConstant } from '@app/const/url-constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  private readonly userService = inject(UserService);

  private readonly _currentUser = signal<User | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();

  private readonly _isUserLoaded = signal(false);
  public readonly isUserLoaded = this._isUserLoaded.asReadonly();

  private routeBeforeLogin: ActivatedRouteSnapshot | null = null;

  public getRefreshedCurrentUser(): Observable<User | null> {
    return this.userService.getCurrentUser().pipe(
      map((user) => {
        this._currentUser.set(user);
        this._isUserLoaded.set(true);
        return user;
      }),
      catchError((error) => {
        this._currentUser.set(null);
        this._isUserLoaded.set(true);
        return throwError(() => error);
      }),
    );
  }

  public userHasRoles(roleList: string[]): Signal<boolean> {
    return computed(() => {
      const user = this.currentUser();
      if (user?.roleList) {
        return !roleList || roleList.every((role) => user.roleList?.includes(role));
      } else {
        return false;
      }
    });
  }

  public redirectToLogin(oldRoute: ActivatedRouteSnapshot | null): void {
    this.routeBeforeLogin = oldRoute;
    this.router.navigate(['/login']);
  }

  public login(username: string, password: string): Observable<boolean> {
    const loginFormData = new FormData();
    loginFormData.append('username', username);
    loginFormData.append('password', password);

    return this.httpClient.post<User>(UrlConstant.LOGIN, loginFormData).pipe(
      map((user) => {
        this._currentUser.set(user);
        if (user && this.routeBeforeLogin?.routeConfig) {
          this.router.navigate([this.routeBeforeLogin.routeConfig.path]);
        }
        return !!user;
      }),
      catchError(() => of(false)),
    );
  }

  public logout(): Observable<void> {
    this._currentUser.set(null);
    return this.httpClient.post<void>(UrlConstant.LOGOUT, null).pipe(catchError(() => of()));
  }
}
