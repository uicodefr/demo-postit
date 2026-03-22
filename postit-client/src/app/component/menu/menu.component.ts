import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { SHARED_MATERIAL, SHARED_ROUTER } from '@app/common-imports';
import { UrlConstant } from '@app/const/url-constant';
import { AuthService } from '@app/service/auth/auth.service';
import { LikeService } from '@app/service/global/like.service';
import { GlobalInfoService } from '@app/service/util/global-info.service';

@Component({
  selector: 'app-menu',
  imports: [
    SHARED_MATERIAL,
    SHARED_ROUTER,
    MatBadgeModule,
    MatProgressBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public exportNotesUrl = UrlConstant.Postit.NOTES_EXPORT;

  private readonly router = inject(Router);
  private readonly globalInfoService = inject(GlobalInfoService);
  private readonly likeService = inject(LikeService);
  private readonly authService = inject(AuthService);

  public readonly isLoggedIn = input(false);

  protected readonly title = signal('Post-It');

  public isLoading = this.globalInfoService.isLoading;
  public countLikes = this.likeService.countLikes;

  ngOnInit(): void {
    this.likeService.listenCountLikeTimer();
  }

  public like(): void {
    this.likeService.addLike();
  }

  public changeLang(lang: string): void {
    const currentLocationUrl = globalThis.location.toString();
    const regexLangInUrl = /\/(en|fr)\//g;
    globalThis.location.assign(currentLocationUrl.replace(regexLangInUrl, '/' + lang + '/'));
  }

  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
