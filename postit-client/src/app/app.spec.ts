import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { GlobalStatus } from '@app/model/global/global-status';
import { AuthService } from '@app/service/auth/auth.service';
import { userAnonymousMock } from '@test/fixture/users.fixture';
import { of, Subject } from 'rxjs';
import { Component, input } from '@angular/core';
import { MenuComponent } from '@app/component/menu/menu.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  template: '<div id="mock-menu"></div>',
})
class MenuStub {
  isLoggedIn = input<boolean>(false);
}

describe('AppComponent', () => {
  let httpMock: HttpTestingController;
  const authServiceMock = {
    currentUser: vi.fn(),
    getRefreshedCurrentUser: vi.fn().mockReturnValue(of(userAnonymousMock())),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    })
      .overrideComponent(App, {
        remove: { imports: [MenuComponent] },
        add: { imports: [MenuStub] },
      })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show loading waiting', async () => {
    const currentUserSubject = new Subject<void>();
    authServiceMock.getRefreshedCurrentUser.mockReturnValue(currentUserSubject.asObservable());

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.initLoading')).not.toBeNull();

    currentUserSubject.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.initLoading')).toBeNull();
  });

  it('should have availableApp = true', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const app = fixture.componentInstance;

    const req = httpMock.expectOne('/api/global/status');
    req.flush({ status: 'true' } as GlobalStatus);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(app.availableApp()).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.unavailableApp')).toBeNull();
  });

  it('should have availableApp = false', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const app = fixture.componentInstance;

    const req = httpMock.expectOne('/api/global/status');
    req.flush({ status: 'false' } as GlobalStatus);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(app.availableApp()).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.unavailableApp')?.textContent).toContain('Application Unavailable');
  });
});
