import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlConstant } from '@app/const/url-constant';
import { appInfo } from '@app/app.info';
import { AuthService } from '@app/service/auth/auth.service';
import { GlobalService } from '@app/service/global/global.service';
import { LikeService } from '@app/service/global/like.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuComponent } from '@app/component/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly globalService = inject(GlobalService);
  private readonly likeService = inject(LikeService);
  private readonly authService = inject(AuthService);

  protected readonly title = signal('Post-It');

  public exportNotesUrl = UrlConstant.Postit.NOTES_EXPORT;

  public initApp = signal(false);
  public availableApp = signal(true);

  public isLoggedIn = computed(() => !!this.authService.currentUser());

  public appVersion = appInfo.version;

  public ngOnInit(): void {
    this.likeService.listenCountLikeTimer();

    // Check app status
    this.globalService.getStatus().subscribe({
      next: (status) => {
        this.availableApp.set(status.status === 'true');
      },
      error: () => {
        this.availableApp.set(false);
      },
    });

    // Get User and init app
    this.authService.getRefreshedCurrentUser().subscribe({
      complete: () => {
        this.initApp.set(true);
      },
    });
  }
}
