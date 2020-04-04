import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client, StompConfig } from '@stomp/stompjs';
import { UrlConstant } from '../../const/url-constant';
import { CountLikes } from '../../model/global/count-likes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private static readonly COUNT_LIKE_TIMER = environment.likeTimerSecond;
  private static readonly LIKE_WEB_SOCKET = environment.likeWebSocket;

  private countLikeSubject = new Subject<number>();

  private stompClient: Client;

  public constructor(private httpClient: HttpClient) {}

  public getCountLikeObservable(): Observable<number> {
    return this.countLikeSubject.asObservable();
  }

  private countLike() {
    this.httpClient
      .get<CountLikes>(UrlConstant.Global.LIKE_COUNT)
      .toPromise()
      .then(countLikes => {
        this.countLikeSubject.next(countLikes.count);
      });
  }

  public listenCountLikeTimer() {
    this.countLike();

    if (LikeService.LIKE_WEB_SOCKET) {
      // Use WebSocket (with Stomp)
      const config = new StompConfig();
      config.brokerURL = this.convertToWebSocketUrl(UrlConstant.WebSocket.CONNECTION);
      config.onConnect = receipt => {
        this.countLike();

        this.stompClient.subscribe(UrlConstant.WebSocket.LISTEN_LIKE_COUNT, countLikesMsg => {
          if (countLikesMsg.command === 'MESSAGE') {
            const countLikes = JSON.parse(countLikesMsg.body) as CountLikes;
            this.countLikeSubject.next(countLikes.count);
          } else {
            console.error('Wrong message from the websocket', countLikesMsg);
          }
        });
      };
      this.stompClient = new Client(config);
      this.stompClient.activate();
    } else {
      // Use HTTP GET periodically
      if (LikeService.COUNT_LIKE_TIMER > 0) {
        setInterval(() => {
          this.countLike();
        }, LikeService.COUNT_LIKE_TIMER * 1000);
      }
    }
  }

  private convertToWebSocketUrl(path: string): string {
    let webSocketUrl = 'ws:';
    if (window.location.protocol === 'https:') {
      webSocketUrl = 'wss:';
    }
    webSocketUrl += '//' + window.location.host;
    webSocketUrl += path;
    return webSocketUrl;
  }

  public addLike() {
    this.httpClient
      .post<void>(UrlConstant.Global.LIKE, null)
      .toPromise()
      .then(() => {
        if (!LikeService.LIKE_WEB_SOCKET) {
          this.countLike();
        }
      });
  }
}
