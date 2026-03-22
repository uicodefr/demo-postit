import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { userAdminMock, userAnonymousMock } from '@test/fixture/users.fixture';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  const globalInfoServiceMock = {
    showAlert: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: GlobalInfoService,
          useValue: globalInfoServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow login', () => {
    let req = httpMock.expectOne('/api/users/me');
    expect(req.request.method).toBe('GET');
    req.flush(userAnonymousMock());
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loginCardContent')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.logoutCardContent')).toBeNull();

    const usernameInput = fixture.nativeElement.querySelector('input[data-testid="usernameInput"]');
    expect(usernameInput.type).toBe('text');
    expect(usernameInput.placeholder).toBe('Username');

    const passwordInput = fixture.nativeElement.querySelector('input[data-testid="passwordInput"]');
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.placeholder).toBe('Password');

    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();
    const submitBtn = fixture.nativeElement.querySelector('button');
    expect(submitBtn.textContent).toContain('LOGIN');

    usernameInput.value = 'usernameTest';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'passwordTest';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitBtn.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-progress-bar')).not.toBeNull();

    req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    const reqBody = req.request.body as FormData;
    expect(reqBody.get('username')).toBe('usernameTest');
    expect(reqBody.get('password')).toBe('passwordTest');
    req.flush(userAdminMock());
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loginCardContent')).toBeNull();
    expect(fixture.nativeElement.querySelector('.logoutCardContent')).not.toBeNull();
  });

  it('should allow logout', () => {
    let req = httpMock.expectOne('/api/users/me');
    expect(req.request.method).toBe('GET');
    req.flush(userAdminMock());
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loginCardContent')).toBeNull();
    expect(fixture.nativeElement.querySelector('.logoutCardContent')).not.toBeNull();

    const textConnected = fixture.nativeElement.querySelector('.alreadyConnected p');
    expect(textConnected.textContent).toContain('You are connected as');
    expect(textConnected.textContent).toContain('userAdmin');

    const logoutBtn = fixture.nativeElement.querySelector('button');
    expect(logoutBtn.className).toContain('mat-warn');
    expect(logoutBtn.textContent).toContain('LOGOUT');

    logoutBtn.click();
    fixture.detectChanges();

    req = httpMock.expectOne('/api/logout');
    expect(req.request.method).toBe('POST');
    req.flush(null);

    expect(fixture.nativeElement.querySelector('.loginCardContent')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.logoutCardContent')).toBeNull();
  });
});
