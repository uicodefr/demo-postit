import { computed, Signal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '@app/model/global/user';
import { Observable } from 'rxjs';

export class MockAuthService {
  private readonly userRoles = signal<string[]>([]);
  private readonly currentUser = signal<User | null>(null);
  private readonly $currentUser = toObservable(this.currentUser);

  public setUserRoles(userRoles: string[]) {
    this.userRoles.set(userRoles);
  }

  public userHasRoles(roleList: string[]): Signal<boolean> {
    return computed(() => {
      const currentRoleList = this.userRoles();
      if (currentRoleList) {
        return !roleList || roleList.every((role) => currentRoleList.includes(role));
      } else {
        return false;
      }
    });
  }

  public setCurrentUser(currentUser: User | null) {
    this.currentUser.set(currentUser);
  }

  public getRefreshedCurrentUser(): Observable<User | null> {
    return this.$currentUser;
  }
}
