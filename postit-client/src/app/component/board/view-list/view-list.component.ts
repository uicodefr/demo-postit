import { Component, inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SHARED_COMMON, SHARED_ROUTER } from '@app/common-imports';

@Component({
  selector: 'app-view-list',
  imports: [SHARED_COMMON, SHARED_ROUTER, MatDividerModule, MatListModule],
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent {
  private readonly matbottomSheetRef = inject(MatBottomSheetRef<ViewListComponent>);
  public readonly bottomData = inject<{ currentView: string }>(MAT_BOTTOM_SHEET_DATA);

  public currentView = this.bottomData.currentView;

  public openLink(): void {
    this.matbottomSheetRef.dismiss();
  }

  public getDynamicClass(linkView: string): string {
    if (linkView === this.currentView || (!this.currentView && linkView === 'tabs')) {
      return 'viewSelected';
    } else {
      return '';
    }
  }
}
