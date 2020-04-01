import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user/user';
import { GlobalInfoService } from '../../service/util/global-info.service';
import { AlertType } from '../../const/alert-type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public userConnected: User;

  public loginForm: FormGroup = null;
  public loginInProgress = false;

  public constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalInfoService: GlobalInfoService
  ) {}

  public ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.userConnected = user;
    });
    this.authService.getRefreshedCurrentUser();

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginInProgress = true;
    const valueForm = this.loginForm.value;

    this.authService.login(valueForm.username, valueForm.password).then(isSignIn => {
      this.loginInProgress = false;
      if (!isSignIn) {
        this.globalInfoService.showAlert(
          AlertType.WARNING,
          $localize`:@@login.signinFailed:Sign-in Failed : Incorrect username or password`,
          3000
        );
      }
    });
  }

  public logout() {
    this.authService.logout();
  }
}
