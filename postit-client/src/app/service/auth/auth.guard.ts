import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthService } from '@app/service/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);

  private readonly isUserLoaded$ = toObservable(this.authService.isUserLoaded).pipe(
    filter((isLoaded) => isLoaded),
    take(1),
  );

  public canActivate(
    next: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles = next.data['roles'] as string[];

    // We wait the User is Loaded before checking roles
    return this.isUserLoaded$.pipe(
      map(() => {
        const hasRoles = this.authService.userHasRoles(roles)();
        if (!hasRoles) {
          this.authService.redirectToLogin(next);
        }
        return hasRoles;
      }),
    );
  }
}
