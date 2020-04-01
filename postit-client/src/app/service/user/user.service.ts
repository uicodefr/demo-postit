import { Injectable } from '@angular/core';
import { User } from '../../model/user/user';
import { UrlConstant } from '../../const/url-constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public constructor(private httpClient: HttpClient) {}

  public getCurrentUser(): Promise<User> {
    return this.httpClient.get<User>(UrlConstant.User.CURRENT_USER).toPromise();
  }

  public getUserList(): Promise<Array<User>> {
    return this.httpClient.get<Array<User>>(UrlConstant.User.USERS).toPromise();
  }

  public createUser(user: User): Promise<User> {
    return this.httpClient.post<User>(UrlConstant.User.USERS, user).toPromise();
  }

  public updateUser(user: User): Promise<User> {
    return this.httpClient.patch<User>(UrlConstant.User.USERS + '/' + user.id, user).toPromise();
  }

  public deleteUser(userId: number): Promise<void> {
    return this.httpClient.delete<void>(UrlConstant.User.USERS + '/' + userId).toPromise();
  }

  public getRoleList(): Promise<Array<string>> {
    return this.httpClient.get<Array<string>>(UrlConstant.User.ROLES).toPromise();
  }
}
