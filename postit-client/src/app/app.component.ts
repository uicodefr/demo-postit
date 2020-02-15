import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { GlobalInfoService } from './service/util/global-info.service';
import { GlobalService } from './service/global/global.service';
import { UrlConstant } from './const/url-constant';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from './service/auth/auth.service';
import { LikeService } from './service/global/like.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private static readonly LOADING_DEBOUNCE_TIME_MS = 100;
  public exportNotesUrl = UrlConstant.Postit.NOTES_EXPORT;

  public initApp = false;
  public availableApp = true;
  public isLoggedIn = false;

  private loading$: Observable<boolean>;
  private likes$: Observable<number>;

  private userSubscription: Subscription = null;

  public constructor(
    private router: Router,
    private globalInfoService: GlobalInfoService,
    private globalService: GlobalService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  public ngOnInit() {
    // Loading information
    this.loading$ = this.globalInfoService
      .getLoaderObservable()
      .pipe(debounceTime(AppComponent.LOADING_DEBOUNCE_TIME_MS));

    // Check app status
    this.globalService
      .getStatus()
      .then(status => {
        this.availableApp = status.status === 'true';
      })
      .catch(error => {
        this.availableApp = false;
      });

    // Get User and init app
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
    });
    this.authService.getRefreshedCurrentUser().finally(() => {
      this.initApp = true;
    });

    // Like subscription
    this.likes$ = this.likeService.getCountLikeObservable();
    this.likeService.listenCountLikeTimer();
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  public like() {
    this.likeService.addLike();
  }

  public changeLang(lang: string) {
    const currentLocationUrl = window.location.toString();
    const regexLangInUrl = /\/(en|fr)\//g;
    window.location.assign(currentLocationUrl.replace(regexLangInUrl, '/' + lang + '/'));
  }

  public logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['']);
    });
  }
}
