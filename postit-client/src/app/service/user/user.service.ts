import { Injectable } from '@angular/core';

import { RestClientService } from '../util/rest-client.service';
import { User } from '../../model/user/user';
import { UrlConstant } from '../../const/url-constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public constructor(private restClientService: RestClientService) {}

  public getCurrentUser(): Promise<User> {
    return this.restClientService.get<User>(UrlConstant.User.CURRENT_USER).toPromise();
  }

  public getUserList(): Promise<Array<User>> {
    return this.restClientService.get<Array<User>>(UrlConstant.User.USERS).toPromise();
  }

  public createUser(user: User): Promise<User> {
    return this.restClientService.post<User>(UrlConstant.User.USERS, user).toPromise();
  }

  public updateUser(user: User): Promise<User> {
    return this.restClientService.patch<User>(UrlConstant.User.USERS + '/' + user.id, user).toPromise();
  }

  public deleteUser(userId: number): Promise<void> {
    return this.restClientService.delete<void>(UrlConstant.User.USERS + '/' + userId).toPromise();
  }

  public getRoleList(): Promise<Array<string>> {
    return this.restClientService.get<Array<string>>(UrlConstant.User.ROLES).toPromise();
  }
}
