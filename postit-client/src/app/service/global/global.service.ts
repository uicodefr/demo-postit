import { Injectable } from '@angular/core';
import { UrlConstant } from '../../const/url-constant';
import { GlobalStatus } from '../../model/global/global-status';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private parameterMap = new Map<string, string>();

  public constructor(private httpClient: HttpClient) {}

  // Status & Parameter

  public getStatus(): Promise<GlobalStatus> {
    return this.httpClient.get<GlobalStatus>(UrlConstant.Global.STATUS).toPromise();
  }

  public getParameterValue(parameterName: string): Promise<string> {
    if (this.parameterMap.has(parameterName)) {
      return Promise.resolve(this.parameterMap.get(parameterName));
    } else {
      return this.httpClient
        .get<string>(UrlConstant.Global.PARAMETERS + '/' + parameterName)
        .toPromise()
        .then(parameterValue => {
          this.parameterMap.set(parameterName, parameterValue);
          return parameterValue;
        });
    }
  }
}
