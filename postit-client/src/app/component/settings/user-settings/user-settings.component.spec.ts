import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsComponent } from './user-settings.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { NEVER, of } from 'rxjs';
import { defaultUserListMock, roleListMock } from '@test/fixture/users.fixture';
import { AlertType } from '@app/const/alert-type';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let httpMock: HttpTestingController;
  const matDialogMock = {
    open: vi.fn().mockImplementation(() => {
      return {
        afterClosed: vi.fn().mockReturnValue(NEVER),
      };
    }),
  };
  const globalInfoServiceMock = {
    showAlert: vi.fn(),
  };

  function mockDialogCloseWithData(data: unknown) {
    // Remock to return note on afterClosed
    matDialogMock.open.mockImplementation(() => {
      return {
        afterClosed: vi.fn().mockReturnValue(of(data)),
      };
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSettingsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: matDialogMock },
        { provide: GlobalInfoService, useValue: globalInfoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
    let req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(defaultUserListMock());

    req = httpMock.expectOne('/api/users/roles');
    expect(req.request.method).toBe('GET');
    req.flush(roleListMock());
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user list', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    expect(tableLineList).toHaveLength(3);

    const headerList = tableLineList[0].querySelectorAll('th');
    expect(headerList[0].textContent).toContain('Id');
    expect(headerList[1].textContent).toContain('Username');
    expect(headerList[2].textContent).toContain('Password');
    expect(headerList[3].textContent).toContain('Roles');
    expect(headerList[4].textContent).toContain('Enabled');
    expect(headerList[5].textContent).toContain('Actions');

    const user1RowList = tableLineList[1].querySelectorAll('td');
    expect(user1RowList[0].textContent).toContain('1');
    expect(user1RowList[1].querySelector('input').value).toContain('admin');
    expect(user1RowList[2].querySelector('input')).not.toBeNull();
    expect(user1RowList[3].querySelector('mat-select')).not.toBeNull();
    expect(user1RowList[4].querySelector('mat-checkbox')).not.toBeNull();

    const saveBtn = user1RowList[5].querySelector('button[data-testid="saveBtn"]');
    expect(saveBtn.textContent).toContain('Save');
    const deleteBtn = user1RowList[5].querySelector('button[data-testid="deleteBtn"]');
    expect(deleteBtn.textContent).toContain('Delete');

    const createBtn = fixture.nativeElement.querySelector('button[data-testid="createBtn"]');
    expect(createBtn.textContent).toContain('Create user');
  });

  it('should save user', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    const user1RowList = tableLineList[1].querySelectorAll('td');
    const usernameInput = user1RowList[1].querySelector('input');

    usernameInput.value = 'username_changed';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const saveBtn = user1RowList[5].querySelector('button[data-testid="saveBtn"]');
    saveBtn.click();

    let req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('PATCH');
    const userChanged = {
      ...defaultUserListMock()[0],
      username: 'username_changed',
    };
    expect(req.request.body).toStrictEqual(userChanged);
    req.flush(userChanged);

    req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'User updated');
  });

  it('should delete user', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    const user1RowList = tableLineList[1].querySelectorAll('td');
    const deleteBtn = user1RowList[5].querySelector('button[data-testid="deleteBtn"]');

    mockDialogCloseWithData(true);
    deleteBtn.click();
    let req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'User deleted');
  });

  it('should create user', () => {
    const createBtn = fixture.nativeElement.querySelector('button[data-testid="createBtn"]');
    createBtn.click();

    let req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    req.flush({});

    req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
  });
});
