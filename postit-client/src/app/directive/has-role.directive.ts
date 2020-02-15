import { Directive, Input, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';

import { AuthService } from '../service/auth/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input()
  public appHasRole: string | Array<string>;

  public constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  public ngOnInit() {
    const roleList = [];
    if (Array.isArray(this.appHasRole)) {
      roleList.push(...this.appHasRole);
    } else {
      roleList.push(this.appHasRole);
    }

    this.authService.userHasRoles(roleList).then(hasRoles => {
      if (hasRoles) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
