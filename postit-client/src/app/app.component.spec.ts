import { TestBed, async, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { GlobalInfoService } from './service/util/global-info.service';
import { GlobalService } from './service/global/global.service';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AuthService } from './service/auth/auth.service';
import { LikeService } from './service/global/like.service';
import { MatMenuModule } from '@angular/material/menu';

describe('AppComponent', () => {

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['getLoaderObservable']);
    globalInfoSpy.getLoaderObservable.and.returnValue(of());

    const globalSpy = jasmine.createSpyObj('GlobalService', ['getStatus', 'launchCountLikeTimer', 'getCountLikeObservable', 'addLike']);
    globalSpy.getStatus.and.returnValue(Promise.resolve({ status: 'true' }));
    globalSpy.getCountLikeObservable.and.returnValue(of());

    const likeSpy = jasmine.createSpyObj('LikeService', ['getCountLikeObservable', 'listenCountLikeTimer']);
    likeSpy.getCountLikeObservable.and.returnValue(of());

    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getRefreshedCurrentUser']);
    authSpy.getRefreshedCurrentUser.and.returnValue(Promise.resolve(null));
    authSpy.getCurrentUser.and.returnValue(of());

    TestBed.configureTestingModule({
      declarations: [
        AppComponent, PageNotFoundComponent
      ],
      providers: [
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        { provide: GlobalService, useValue: globalSpy },
        { provide: LikeService, useValue: likeSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      imports: [
        RouterModule.forRoot([{
          path: '',
          component: PageNotFoundComponent
        }]), MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatMenuModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have availableApp = true', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.availableApp).toEqual(true);

    fixture.whenStable().then(() => {
      expect(app.availableApp).toEqual(true);
    });
  }));

  it('should render a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app.initApp).toEqual(false);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(app.initApp).toEqual(true);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('Post-It');
    });
  }));

});
