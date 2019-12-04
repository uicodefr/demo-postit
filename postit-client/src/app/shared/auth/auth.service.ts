import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { User } from '../model/user/user';
import { UserService } from '../service/user/user.service';
import { UrlConstant } from '../const/url-constant';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userInitialized = false;
  private currentUser: User;

  private userSubject = new Subject<User>();
  private userObservable = this.userSubject.asObservable();

  private routeBeforeLogin: ActivatedRouteSnapshot;

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService
  ) { }

  public getUserObservable(): Observable<User> {
    return this.userObservable;
  }

  public getCurrentUser(): User {
    if (!this.userInitialized) {
      console.error('User not already initialized');
    }
    return this.currentUser;
  }

  public getRefreshedCurrentUser(): Promise<User> {
    return this.userService.getCurrentUser().then(user => {
      this.userInitialized = true;
      this.currentUser = user;
      this.userSubject.next(user);
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
        this.userSubject.next(user);
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
      this.userSubject.next(null);
      return this.httpClient.get<void>(UrlConstant.LOGOUT).toPromise().finally(() => {
        resolve();
      });
    });
  }

}
