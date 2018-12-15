import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { GlobalInfoService } from './shared/service/utils/global-info.service';
import { GlobalService } from './shared/service/global/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public availableApp = true;
  public loading = false;
  public likes: number = null;

  private loadingSubscription: Subscription = null;
  private likesSubscription: Subscription = null;

  public constructor(
    private globalInfoService: GlobalInfoService,
    private globalService: GlobalService
  ) { }

  public ngOnInit() {
    this.globalService.getStatus().then(status => {
      this.availableApp = status.status === 'true';
    }).catch(error => {
      this.availableApp = false;
    });

    this.loadingSubscription = this.globalInfoService.getLoaderObservable().subscribe(displayLoader => {
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

}
