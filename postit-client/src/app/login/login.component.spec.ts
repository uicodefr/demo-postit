import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../shared/auth/auth.service';
import { TranslateService } from '../shared/service/utils/translate.service';
import { GlobalInfoService } from '../shared/service/utils/global-info.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authSpy.getCurrentUser.and.returnValue(of(null));

    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['showAlert']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        TranslateService,
        { provide: GlobalInfoService, useValue: globalInfoSpy }
      ],
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatProgressBarModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
