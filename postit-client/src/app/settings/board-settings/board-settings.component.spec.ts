import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { BoardSettingsComponent } from './board-settings.component';
import { GlobalInfoService } from 'src/app/shared/service/util/global-info.service';
import { PostitService } from 'src/app/shared/service/postit/postit.service';
import { TranslateService } from 'src/app/shared/service/util/translate.service';

describe('BoardSettingsComponent', () => {
  let component: BoardSettingsComponent;
  let fixture: ComponentFixture<BoardSettingsComponent>;

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['showAlert']);
    const postitSpy = jasmine.createSpyObj('PostitService', ['getBoardList']);
    postitSpy.getBoardList.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [BoardSettingsComponent],
      providers: [
        MatDialog,
        { provide: PostitService, useValue: postitSpy },
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        TranslateService
      ],
      imports: [BrowserAnimationsModule, FormsModule, MatDialogModule, MatInputModule, MatTableModule, MatPaginatorModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
