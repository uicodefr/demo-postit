import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { GlobalInfoService } from './global-info.service';
import { UrlConstant } from '../../const/url-constant';
import { AlertType } from '../../const/alert-type';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  public constructor(
    private httpClient: HttpClient,
    private globalInfoService: GlobalInfoService
  ) { }

  // GET, POST, PUT, DELETE in JSON

  public get<T>(url: string, paramData?: any): Observable<T> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.get(UrlConstant.BASE + url + this.paramDataToGetUrl(paramData), this.getJsonRequestOptions());
    return this.addMapperAndCatcher<T>(obsResponse, url);
  }

  public post<T>(url: string, paramData?: any): Observable<T> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.post(UrlConstant.BASE + url, paramData, this.getJsonRequestOptions());
    return this.addMapperAndCatcher<T>(obsResponse, url);
  }

  public put<T>(url: string, paramData?: any): Observable<T> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.put(UrlConstant.BASE + url, paramData, this.getJsonRequestOptions());
    return this.addMapperAndCatcher<T>(obsResponse, url);
  }

  public patch<T>(url: string, paramData?: any): Observable<T> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.patch(UrlConstant.BASE + url, paramData, this.getJsonRequestOptions());
    return this.addMapperAndCatcher<T>(obsResponse, url);
  }

  public delete<T>(url: string): Observable<T> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.delete(UrlConstant.BASE + url, this.getJsonRequestOptions());
    return this.addMapperAndCatcher<T>(obsResponse, url);
  }

  // Blob

  public getBlob(url: string, paramData?: any): Observable<{} | Blob> {
    this.globalInfoService.notifLoader(true);
    const obsResponse = this.httpClient.get(UrlConstant.BASE + url + this.paramDataToGetUrl(paramData),
      { observe: 'body', responseType: 'blob' }).pipe(
        catchError(this.handleError(this.globalInfoService, url))).pipe(finalize(() => {
          this.globalInfoService.notifLoader(false);
        }));
    return obsResponse;
  }

  // Internal Method

  private getJsonRequestOptions(): {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe: 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  } {
    return { observe: 'response', responseType: 'json' };
  }

  private addMapperAndCatcher<T>(obsResponse: Observable<HttpResponse<Object>>, url: string): Observable<T> {
    return obsResponse.pipe(catchError(this.handleError(this.globalInfoService, url)))
      .pipe(map((response) => response.body))
      .pipe(finalize(() => {
        this.globalInfoService.notifLoader(false);
      })) as Observable<T>;
  }

  private paramDataToGetUrl(paramData?: any): string {
    if (!paramData) {
      return '';
    }

    let getUrl = '?';
    if ('string' === typeof paramData) {
      getUrl += paramData;

    } else if ('object' === typeof paramData) {
      for (const keyName of Object.keys(paramData)) {
        if (getUrl !== '?' && getUrl.charAt(getUrl.length - 1) !== '&') {
          getUrl += '&';
        }

        const valueParam = paramData[keyName];
        if (valueParam === null || valueParam === undefined) {
          // do nothing if null or undefined
        } else if (Array.isArray(valueParam)) {
          let i = 0;
          for (const valueInTable of valueParam) {
            getUrl += (i === 0 ? '' : '&');
            getUrl += keyName + '=' + encodeURIComponent(valueInTable);
            i++;
          }
          if (valueParam.length === 0) {
            getUrl += keyName + '=';
          }
        } else if (typeof valueParam === 'object') {
          getUrl += keyName + '=' + JSON.stringify(valueParam);
        } else {
          getUrl += keyName + '=' + encodeURIComponent(valueParam);
        }
      }
    }

    return getUrl;
  }

  private handleError(globalInfoService: GlobalInfoService, url: string) {
    return function (err) {
      let errMsg = url + ' - ';
      let errResult = null;
      if (err instanceof HttpErrorResponse) {
        errMsg = errMsg + err.status + ' ' + err.statusText;
        errResult = err.status;
      } else {
        errMsg = errMsg + err;
        errResult = errMsg;
      }

      globalInfoService.showAlert(AlertType.DANGER, 'Error on HttpRequest : ' + errMsg);
      return throwError(errResult);
    };
  }

}
