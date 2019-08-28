import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user/user';
import { UserService } from '../service/user/user.service';
import { UrlConstant } from '../const/url-constant';
import { InitService } from './init.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userInitialized = false;
  private currentUser: User;

  private routeBeforeLogin: ActivatedRouteSnapshot;

  public constructor(
    private initService: InitService,
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService
  ) {
  }

  public getCurrentUser(): User {
    if (!this.userInitialized) {
      this.currentUser = this.initService.getInitUser();
      this.userInitialized = true;
    }

    return this.currentUser;
  }

  public getRefreshedCurrentUser(): Promise<User> {
    return this.userService.getCurrentUser().then(user => {
      this.currentUser = user;
      return this.currentUser;
    });
  }

  public hasRoles(roleList: Array<string>) {
    return this.currentUser && roleList && roleList.every(role => this.currentUser.roleList.includes(role));
  }

  public redirectToLogin(oldRoute: ActivatedRouteSnapshot) {
    this.routeBeforeLogin = oldRoute;
    this.router.navigate(['/login']);
  }

  public login(username: string, password: string): Promise<boolean> {
    const loginFormData = new FormData();
    loginFormData.append('username', username);
    loginFormData.append('password', password);

    return this.httpClient.post<User>(UrlConstant.LOGIN, loginFormData).toPromise()
      .then(user => {
        this.currentUser = user;
        if (this.currentUser != null && this.routeBeforeLogin != null && this.routeBeforeLogin.routeConfig != null) {
          this.router.navigate([this.routeBeforeLogin.routeConfig.path]);
        }
        return this.currentUser != null;

      }).catch(error => {
        return false;
      });
  }

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentUser = null;
      return this.httpClient.get<void>(UrlConstant.LOGOUT).toPromise().finally(() => {
        resolve();
      });
    });
  }

}
