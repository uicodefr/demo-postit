import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from './app-material.module';
import { UrlConstant } from './const/url-constant';
import { User } from './model/user/user';
import { GlobalStatus } from './model/global/global-status';
import { CountLikes } from './model/global/count-likes';

let httpMock: HttpTestingController;

function setTimeoutPromise(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      declarations: [AppComponent, PageNotFoundComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
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

  it('should render a h1 tag', async(async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges(true);
    const app = fixture.debugElement.componentInstance;
    expect(app.initApp).toEqual(false);

    const mockRequestUser = httpMock.expectOne(UrlConstant.User.CURRENT_USER);
    mockRequestUser.flush({ id: 1, username: 'user', enabled: true, roleList: ['ROLE_USER'] } as User);
    const mockRequestStatus = httpMock.expectOne(UrlConstant.Global.STATUS);
    mockRequestStatus.flush({ status: 'true' } as GlobalStatus);
    const mockRequestLikeCount = httpMock.expectOne(UrlConstant.Global.LIKE_COUNT);
    mockRequestLikeCount.flush({ count: 12 } as CountLikes);

    httpMock.verify();
    // Wait 1s because the observable $likes
    await setTimeoutPromise(1000);

    fixture.whenStable().then(() => {
      expect(app.initApp).toEqual(true);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('Post-It');
      expect(compiled.querySelector('.mat-badge-content').textContent).toEqual(12);
    });
  }));
});
