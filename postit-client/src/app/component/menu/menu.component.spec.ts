import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/service/auth/auth.service';
import { signal } from '@angular/core';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { LikeService } from '@app/service/global/like.service';

describe('MenuComponent', () => {
  const globalInfoServiceMock = {
    isLoading: signal(false),
  };
  const authServiceMock = {
    logout: vi.fn(),
  };

  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: GlobalInfoService,
          useValue: globalInfoServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    const likeService = TestBed.inject(LikeService);
    vi.spyOn(likeService, 'listenCountLikeTimer').mockReturnValue();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner if isLoading is true', () => {
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();

    globalInfoServiceMock.isLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();

    globalInfoServiceMock.isLoading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
  });

  it('should add like if clicked', () => {
    const likeBtn = fixture.nativeElement.querySelector('button[data-testid="likeBtn"]');
    expect(likeBtn.title).toBe('Like');

    likeBtn.click();
    const req = httpMock.expectOne('/api/global/likes');
    expect(req.request.method).toBe('POST');
  });
});
