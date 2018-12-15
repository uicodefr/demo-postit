import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RestClientService } from '../utils/rest-client.service';
import { environment } from '../../../../environments/environment';
import { UrlConstant } from '../../const/url-constant';
import { CountLikes } from '../../model/global/count-likes';
import { GlobalStatus } from '../../model/global/global-status';

@Injectable({
  providedIn: 'root'
})
export class GlobalService implements OnInit, OnDestroy {

  private static readonly COUNT_LIKE_TIMER = environment.likeTimerSecond;

  private countLikeSubject = new Subject<number>();
  private countLikeObservable = this.countLikeSubject.asObservable();

  private parameterMap = new Map<string, string>();

  public constructor(
    private restClientService: RestClientService
  ) { }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this.countLikeSubject.unsubscribe();
  }

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

  // Like

  public getCountLikeObservable(): Observable<number> {
    return this.countLikeObservable;
  }

  private countLike() {
    this.restClientService.get<CountLikes>(UrlConstant.Global.LIKE_COUNT).toPromise().then(countLikes => {
      this.countLikeSubject.next(countLikes.count);
    });
  }

  public launchCountLikeTimer() {
    this.countLike();
    if (GlobalService.COUNT_LIKE_TIMER > 0) {
      setTimeout(() => {
        this.launchCountLikeTimer();
      }, GlobalService.COUNT_LIKE_TIMER * 1000);
    }
  }

  public addLike() {
    this.restClientService.post<void>(UrlConstant.Global.LIKE).toPromise().then(() => {
      this.countLike();
    });
  }

}
