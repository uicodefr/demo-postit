import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@app/service/auth/auth.service';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { AlertType } from '@app/const/alert-type';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SHARED_MATERIAL } from '@app/common-imports';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    SHARED_MATERIAL,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly globalInfoService = inject(GlobalInfoService);

  public userConnected = this.authService.currentUser;
  public loginInProgress = signal(false);

  public loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public ngOnInit(): void {
    this.authService.getRefreshedCurrentUser();
  }

  public onSubmit(): void {
    if (!this.loginForm || this.loginForm.invalid) {
      return;
    }

    this.loginInProgress.set(true);
    const valueForm = this.loginForm.value;

    this.authService.login(valueForm.username ?? '', valueForm.password ?? '').subscribe((isSignIn) => {
      this.loginInProgress.set(false);
      if (!isSignIn) {
        this.globalInfoService.showAlert(
          AlertType.WARNING,
          $localize`:@@login.signinFailed:Sign-in Failed : Incorrect username or password`,
          3000,
        );
      }
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
