import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { User } from 'src/app/shared/model/user/user';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from 'src/app/shared/service/util/translate.service';
import { ConfirmDialogData, ConfirmDialogComponent } from 'src/app/shared/component/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from 'src/app/shared/const/global-constant';
import { UserService } from 'src/app/shared/service/user/user.service';
import { AlertType } from 'src/app/shared/const/alert-type';
import { GlobalInfoService } from 'src/app/shared/service/util/global-info.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  public PASSWORD_PATTERN = '^\\w{5,}$';

  public displayedColumns = ['id', 'username', 'password', 'roleList', 'enabled', 'actions'];
  public dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  public roleList: Array<string>;

  public constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private globalInfoService: GlobalInfoService,
    private translateService: TranslateService
  ) { }

  public ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getUserList();
    this.getRoleList();
  }

  public refresh() {
    this.getUserList();
  }

  private getUserList() {
    this.userService.getUserList().then(userList => {
      this.dataSource.data = userList;
    });
  }

  private getRoleList() {
    this.userService.getRoleList().then(roleList => {
      this.roleList = roleList;
    });
  }

  public isValidForSave(user: User): boolean {
    return user && user.username && user.username.length > 1 &&
      (!user.password || new RegExp(this.PASSWORD_PATTERN).test(user.password));
  }

  public saveUser(user: User) {
    if (!this.isValidForSave(user)) {
      return;
    }
    this.userService.updateUser(user).then(updatedUser => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('User updated'));
      this.getUserList();
    });
  }

  public deleteUser(user: User) {
    const confirmDialogData = {
      title: this.translateService.get('Delete user'),
      message: this.translateService.get('Are you sure to delete this user ?'),
      confirm: this.translateService.get('Delete'),
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData
    });

    confirmDialog.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        this.userService.deleteUser(user.id).then(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('User deleted'));
          this.getUserList();
        });
      }
    });
  }

  public createUser() {
    const newUser = new User();
    newUser.username = this.translateService.get('username');
    newUser.enabled = false;

    this.userService.createUser(newUser).then(createdUser => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('User created'));
      this.getUserList();
    });
  }

}
