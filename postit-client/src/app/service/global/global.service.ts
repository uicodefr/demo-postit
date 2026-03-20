import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { UrlConstant } from '@app/const/url-constant';
import { GlobalStatus } from '@app/model/global/global-status';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private readonly httpClient = inject(HttpClient);
  private readonly parameterMap = new Map<string, string>();

  // Status & Parameter

  public getStatus(): Observable<GlobalStatus> {
    return this.httpClient.get<GlobalStatus>(UrlConstant.Global.STATUS);
  }

  public getParameterValue(parameterName: string): Observable<string | undefined> {
    if (this.parameterMap.has(parameterName)) {
      return of(this.parameterMap.get(parameterName));
    } else {
      return this.httpClient.get<string>(UrlConstant.Global.PARAMETERS + '/' + parameterName).pipe(
        map((parameterValue) => {
          this.parameterMap.set(parameterName, parameterValue);
          return parameterValue;
        }),
      );
    }
  }
}
