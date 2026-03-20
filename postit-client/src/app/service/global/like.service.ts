import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Client, StompConfig } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { UrlConstant } from '@app/const/url-constant';
import { CountLikes } from '@app/model/global/count-likes';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private static readonly COUNT_LIKE_TIMER = environment.likeTimerSecond;
  private static readonly LIKE_WEB_SOCKET = environment.likeWebSocket;

  private readonly httpClient = inject(HttpClient);

  private readonly _countLikes = signal<number>(0);
  public readonly countLikes = this._countLikes.asReadonly();

  private stompClient: Client | undefined;

  public listenCountLikeTimer(): void {
    this.countLike();

    if (LikeService.LIKE_WEB_SOCKET) {
      // Use WebSocket (with Stomp)
      const config = new StompConfig();
      config.brokerURL = this.convertToWebSocketUrl(UrlConstant.WebSocket.CONNECTION);
      config.onConnect = () => {
        this.countLike();

        if (!this.stompClient) {
          return;
        }

        this.stompClient.subscribe(UrlConstant.WebSocket.LISTEN_LIKE_COUNT, (countLikesMsg) => {
          if (countLikesMsg.command === 'MESSAGE') {
            const countLikes = JSON.parse(countLikesMsg.body) as CountLikes;
            this._countLikes.set(countLikes.count);
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

  public addLike(): void {
    this.httpClient.post<void>(UrlConstant.Global.LIKE, null).subscribe(() => {
      if (!LikeService.LIKE_WEB_SOCKET) {
        this.countLike();
      }
    });
  }

  private countLike(): void {
    this.httpClient.get<CountLikes>(UrlConstant.Global.LIKE_COUNT).subscribe((countLikes) => {
      this._countLikes.set(countLikes.count);
    });
  }

  private convertToWebSocketUrl(path: string): string {
    let webSocketUrl = 'ws:';
    if (globalThis.location.protocol === 'https:') {
      webSocketUrl = 'wss:';
    }
    webSocketUrl += '//' + globalThis.location.host;
    webSocketUrl += path;
    return webSocketUrl;
  }
}
