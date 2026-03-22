import { Directive, ViewContainerRef, TemplateRef, inject, input, effect } from '@angular/core';

import { AuthService } from '@app/service/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly authService = inject(AuthService);

  public readonly appHasRole = input<string | string[] | null>(null);

  constructor() {
    effect(() => {
      const roleList = this.getRoleList();
      const hasRoles = this.authService.userHasRoles(roleList)();

      if (hasRoles) {
        if (this.viewContainerRef.length === 0) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  private getRoleList(): string[] {
    const hasRoleValue = this.appHasRole();
    const roleList: string[] = [];

    if (Array.isArray(hasRoleValue)) {
      roleList.push(...hasRoleValue);
    } else if (hasRoleValue) {
      roleList.push(hasRoleValue);
    }
    return roleList;
  }
}
