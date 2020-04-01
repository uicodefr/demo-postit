import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {
  constructor(private matbottomSheetRef: MatBottomSheetRef<ViewListComponent>) {}

  public ngOnInit(): void {}

  public openLink(event: MouseEvent): void {
    this.matbottomSheetRef.dismiss();
  }
}
