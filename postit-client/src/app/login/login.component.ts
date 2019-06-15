import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/model/user/user';
import { GlobalInfoService } from '../shared/service/utils/global-info.service';
import { AlertType } from '../shared/const/alert-type';
import { TranslateService } from '../shared/service/utils/translate.service';

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
    private translateService: TranslateService,
    private globalInfoService: GlobalInfoService
  ) {
  }

  public ngOnInit() {
    this.userConnected = this.authService.getCurrentUser();
    this.authService.getRefreshedCurrentUser().then(user => {
      this.userConnected = user;
    });

    this.loginForm = this.formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]]
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
      this.userConnected = this.authService.getCurrentUser();
      if (!isSignIn) {
        this.globalInfoService.showAlert(AlertType.WARNING,
          this.translateService.get('Sign-in Failed : Incorrect username or password'), 3000);
      }
    });
  }

  public logout() {
    this.authService.logout().then(() => {
      this.userConnected = this.authService.getCurrentUser();
    });
  }

}
