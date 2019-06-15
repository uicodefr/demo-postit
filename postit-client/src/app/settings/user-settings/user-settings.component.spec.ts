import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UserSettingsComponent } from './user-settings.component';
import { TranslateService } from 'src/app/shared/service/utils/translate.service';
import { UserService } from 'src/app/shared/service/user/user.service';
import { GlobalInfoService } from 'src/app/shared/service/utils/global-info.service';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['showAlert']);
    const userSpy = jasmine.createSpyObj('PostitService', ['getUserList', 'getRoleList']);
    userSpy.getUserList.and.returnValue(Promise.resolve([]));
    userSpy.getRoleList.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      providers: [
        MatDialog,
        { provide: UserService, useValue: userSpy },
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        TranslateService
      ],
      imports: [BrowserAnimationsModule, FormsModule, MatDialogModule, MatInputModule, MatTableModule, MatPaginatorModule,
        MatSelectModule, MatCheckboxModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
