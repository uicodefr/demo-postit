import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public constructor(
    private authService: AuthService
  ) { }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this.authService.getCurrentUser();
    const roles = next.data.roles as Array<string>;

    const activate = currentUser && (!roles || roles.every(role => currentUser.roleList.includes(role)));
    if (!activate) {
      this.authService.redirectToLogin(next);
    }

    return activate;
  }

}
