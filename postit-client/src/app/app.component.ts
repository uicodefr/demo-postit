import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GlobalInfoService } from './shared/service/utils/global-info.service';
import { GlobalService } from './shared/service/global/global.service';
import { UrlConstant } from './shared/const/url-constant';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from './shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private static readonly LOADING_DEBOUNCE_TIME_MS = 100;

  public availableApp = true;
  public loading = false;
  public likes: number = null;
  public exportNotesUrl = UrlConstant.Postit.NOTES_EXPORT;

  private loadingSubscription: Subscription = null;
  private likesSubscription: Subscription = null;

  public constructor(
    private router: Router,
    private globalInfoService: GlobalInfoService,
    private globalService: GlobalService,
    private authService: AuthService
  ) { }

  public ngOnInit() {
    this.globalService.getStatus().then(status => {
      this.availableApp = status.status === 'true';
    }).catch(error => {
      this.availableApp = false;
    });

    this.loadingSubscription = this.globalInfoService.getLoaderObservable()
      .pipe(debounceTime(AppComponent.LOADING_DEBOUNCE_TIME_MS))
      .subscribe(displayLoader => {
        this.loading = displayLoader;
      });

    this.likesSubscription = this.globalService.getCountLikeObservable().subscribe(countLike => {
      this.likes = countLike;
    });
    this.globalService.launchCountLikeTimer();
  }

  public ngOnDestroy() {
    if (this.loadingSubscription != null) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.likesSubscription != null) {
      this.likesSubscription.unsubscribe();
    }
  }

  public like() {
    this.globalService.addLike();
  }

  public get isLoggedIn() {
    return this.authService.getCurrentUser();
  }

  public logout() {
    if (!this.authService.getCurrentUser()) {
      return;
    }

    this.authService.logout().then(() => {
      this.router.navigate(['']);
    });
  }

}
