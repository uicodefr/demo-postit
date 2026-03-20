import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { User } from '@app/model/global/user';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogData,
  ConfirmDialogComponent,
} from '@app/component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from '@app/const/global-constant';
import { UserService } from '@app/service/global/user.service';
import { AlertType } from '@app/const/alert-type';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { SHARED_FORM, SHARED_MATERIAL } from '@app/common-imports';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-settings',
  imports: [
    SHARED_FORM,
    SHARED_MATERIAL,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly globalInfoService = inject(GlobalInfoService);

  public readonly paginator = viewChild(MatPaginator);

  public readonly passwordPattern = '^\\w{5,}$';
  public displayedColumns = ['id', 'username', 'password', 'roleList', 'enabled', 'actions'];
  public dataSource = new MatTableDataSource<User>();

  public roleList: string[] = [];

  public ngOnInit(): void {
    if (this.paginator()) {
      this.dataSource.paginator = this.paginator();
    }
    this.getUserList();
    this.getRoleList();
  }

  public refresh(): void {
    this.getUserList();
  }

  public isValidForSave(user: User): boolean {
    return !!(
      user?.username &&
      user.username.length > 1 &&
      (!user.password || new RegExp(this.passwordPattern).test(user.password))
    );
  }

  public saveUser(user: User): void {
    if (!this.isValidForSave(user)) {
      return;
    }
    this.userService.updateUser(user).subscribe(() => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@userSettings.userUpdated:User updated`);
      this.getUserList();
    });
  }

  public deleteUser(user: User): void {
    const confirmDialogData = {
      title: $localize`:@@userSettings.deleteUser:Delete user`,
      message: $localize`:@@userSettings.deleteUserConfirm:Are you sure to delete this user ?`,
      confirm: $localize`:@@global.delete:Delete`,
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData,
    });

    confirmDialog.afterClosed().subscribe((confirmation) => {
      if (confirmation === true && user.id) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@userSettings.userDeleted:User deleted`);
          this.getUserList();
        });
      }
    });
  }

  public createUser(): void {
    const newUser = {} as User;
    newUser.username = $localize`:@@userSettings.username:Username`;
    newUser.enabled = false;

    this.userService.createUser(newUser).subscribe(() => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@userSettings.userCreated:User created`);
      this.getUserList();
    });
  }

  private getUserList(): void {
    this.userService.getUserList().subscribe((userList) => {
      this.dataSource.data = userList;
    });
  }

  private getRoleList(): void {
    this.userService.getRoleList().subscribe((roleList) => {
      this.roleList = roleList;
    });
  }
}
