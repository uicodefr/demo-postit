import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstant } from '@app/const/url-constant';
import { User } from '@app/model/global/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  public getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(UrlConstant.User.CURRENT_USER);
  }

  public getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(UrlConstant.User.USERS);
  }

  public createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(UrlConstant.User.USERS, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.patch<User>(UrlConstant.User.USERS + '/' + user.id, user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(UrlConstant.User.USERS + '/' + userId);
  }

  public getRoleList(): Observable<string[]> {
    return this.httpClient.get<string[]>(UrlConstant.User.ROLES);
  }
}
