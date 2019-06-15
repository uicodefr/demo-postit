import { Injectable } from '@angular/core';

import { RestClientService } from '../service/utils/rest-client.service';
import { User } from '../model/user/user';
import { UrlConstant } from '../const/url-constant';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private initUser: User;

  public constructor(
    private restClientService: RestClientService,
  ) {
  }

  public startupInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.restClientService.get<User>(UrlConstant.User.CURRENT_USER).toPromise().then(user => {

        this.initUser = user;
        resolve();

      }).catch(error => {
        reject(error);
      });
    });
  }

  public getInitUser(): User {
    return this.initUser;
  }

}
