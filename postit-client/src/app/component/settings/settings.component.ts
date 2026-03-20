import { Component, inject, OnInit, viewChild } from '@angular/core';

import { AuthService } from '@app/service/auth/auth.service';
import { BoardSettingsComponent } from './board-settings/board-settings.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { SHARED_MATERIAL } from '@app/common-imports';
import { HasRoleDirective } from '@app/directive/has-role.directive';

@Component({
  selector: 'app-settings',
  imports: [
    UserSettingsComponent,
    BoardSettingsComponent,
    HasRoleDirective,
    SHARED_MATERIAL,
    MatAccordion,
    MatExpansionModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private readonly authService = inject(AuthService);

  public readonly boardSettings = viewChild<BoardSettingsComponent>('boardSettings');
  public readonly userSettings = viewChild<UserSettingsComponent>('userSettings');

  public ngOnInit(): void {
    this.authService.getRefreshedCurrentUser();
  }

  public refresh(): void {
    this.boardSettings()?.refresh();
    this.userSettings()?.refresh();
  }
}
