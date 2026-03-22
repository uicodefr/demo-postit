import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { BoardSettingsComponent } from '@app/component/settings/board-settings/board-settings.component';
import { UserSettingsComponent } from '@app/component/settings/user-settings/user-settings.component';
import { Component } from '@angular/core';
import { AuthService } from '@app/service/auth/auth.service';
import { MockAuthService } from '@test/mock/auth.service.mock';

const refreshBoard = vi.fn();
@Component({
  selector: 'app-board-settings',
  standalone: true,
  template: '<div id="mock-board-settings"></div>',
})
class BoardSettingsStub {
  public refresh = refreshBoard;
}

const refreshUser = vi.fn();
@Component({
  selector: 'app-user-settings',
  standalone: true,
  template: '<div id="mock-user-settings"></div>',
})
class UserSettingsStub {
  public refresh = refreshUser;
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    })
      .overrideComponent(SettingsComponent, {
        remove: { imports: [BoardSettingsComponent, UserSettingsComponent] },
        add: { imports: [BoardSettingsStub, UserSettingsStub] },
      })
      .compileComponents();

    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
    mockAuthService.setUserRoles(['ROLE_BOARD_WRITE', 'ROLE_USER_WRITE']);

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should info user and board configuration', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Settings');
    const refreshBtn = fixture.nativeElement.querySelector('button[data-testid="refreshBtn"]');
    expect(refreshBtn.title).toBe('Refresh');

    // Board
    expect(fixture.nativeElement.querySelector('[data-testid="boardPanel"] mat-panel-title').textContent).toContain(
      'Board Configuration',
    );
    expect(
      fixture.nativeElement.querySelector('[data-testid="boardPanel"] mat-panel-description').textContent,
    ).toContain('Add, update and delete boards');
    expect(fixture.nativeElement.querySelector('[data-testid="boardPanel"] app-board-settings')).not.toBeNull();

    // User
    expect(fixture.nativeElement.querySelector('[data-testid="userPanel"] mat-panel-title').textContent).toContain(
      'User Configuration',
    );
    expect(
      fixture.nativeElement.querySelector('[data-testid="userPanel"] mat-panel-description').textContent,
    ).toContain('Add, update and delete users');
    expect(fixture.nativeElement.querySelector('[data-testid="userPanel"] app-user-settings')).not.toBeNull();
  });

  it('should refresh child components if refresh btn clicked', () => {
    expect(refreshBoard).not.toHaveBeenCalled();
    expect(refreshUser).not.toHaveBeenCalled();

    const refreshBtn = fixture.nativeElement.querySelector('button[data-testid="refreshBtn"]');
    refreshBtn.click();

    expect(refreshBoard).toHaveBeenCalled();
    expect(refreshUser).toHaveBeenCalled();
  });

  it('should not show panel if the role is absent', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="boardPanel"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="userPanel"]')).not.toBeNull();

    mockAuthService.setUserRoles([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="boardPanel"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="userPanel"]')).toBeNull();
  });
});
