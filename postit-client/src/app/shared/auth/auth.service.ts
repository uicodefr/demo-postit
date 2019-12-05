import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ReplaySubject, Observable } from "rxjs";
import { User } from "../model/user/user";
import { UserService } from "../service/user/user.service";
import { UrlConstant } from "../const/url-constant";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private userSubject = new ReplaySubject<User>(1);
  private userObservable = this.userSubject.asObservable();

  private routeBeforeLogin: ActivatedRouteSnapshot;

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  public getCurrentUser(): Observable<User> {
    return this.userObservable;
  }

  public getRefreshedCurrentUser(): Promise<User> {
    return this.userService.getCurrentUser().then(user => {
      this.userSubject.next(user);
      return user;
    });
  }

  public userHasRoles(roleList: Array<string>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const subscription = this.getCurrentUser().subscribe(
        user => resolve(user && (!roleList || roleList.every(role => user.roleList.includes(role)))),
        error => reject(error),
        () => subscription.unsubscribe()
      );
    });
  }

  public redirectToLogin(oldRoute: ActivatedRouteSnapshot) {
    this.routeBeforeLogin = oldRoute;
    this.router.navigate(["/login"]);
  }

  public login(username: string, password: string): Promise<boolean> {
    const loginFormData = new FormData();
    loginFormData.append("username", username);
    loginFormData.append("password", password);

    return this.httpClient.post<User>(UrlConstant.LOGIN, loginFormData).toPromise()
      .then(user => {
        this.userSubject.next(user);
        if (
          user != null &&
          this.routeBeforeLogin != null &&
          this.routeBeforeLogin.routeConfig != null
        ) {
          this.router.navigate([this.routeBeforeLogin.routeConfig.path]);
        }
        return user != null;
      })
      .catch(error => {
        return false;
      });
  }

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userSubject.next(null);
      return this.httpClient.get<void>(UrlConstant.LOGOUT).toPromise().finally(() => {
          resolve();
      });
    });
  }

}
