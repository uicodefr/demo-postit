import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { AuthService } from '../shared/auth/auth.service';
import { HasRoleDirective } from '../shared/directive/has-role.directive';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getRefreshedCurrentUser', 'hasRoles']);

    TestBed.configureTestingModule({
      declarations: [SettingsComponent, HasRoleDirective],
      providers: [
        { provide: AuthService, useValue: authSpy },
      ],
      imports: [MatExpansionModule, MatIconModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
