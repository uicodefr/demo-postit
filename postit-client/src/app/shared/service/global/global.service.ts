import { Injectable } from '@angular/core';

import { RestClientService } from '../utils/rest-client.service';
import { UrlConstant } from '../../const/url-constant';
import { GlobalStatus } from '../../model/global/global-status';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private parameterMap = new Map<string, string>();

  public constructor(
    private restClientService: RestClientService
  ) { }

  // Status & Parameter

  public getStatus(): Promise<GlobalStatus> {
    return this.restClientService.get<GlobalStatus>(UrlConstant.Global.STATUS).toPromise();
  }

  public getParameterValue(parameterName: string): Promise<string> {
    if (this.parameterMap.has(parameterName)) {
      return Promise.resolve(this.parameterMap.get(parameterName));
    } else {
      const promise = this.restClientService.get<string>(UrlConstant.Global.PARAMETERS + '/' + parameterName).toPromise();
      promise.then(parameterValue => {
        this.parameterMap.set(parameterName, parameterValue);
      });
      return promise;
    }
  }

}
