import { Directive, Input, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() appHasRole: string | Array<string>;

  public constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) { }

  public ngOnInit() {
    const roleList = [];
    if (Array.isArray(this.appHasRole)) {
      roleList.push(... this.appHasRole);
    } else {
      roleList.push(this.appHasRole);
    }

    if (this.authService.hasRoles(roleList)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
