import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BoardNoteComponent } from './board-note.component';
import { GlobalInfoService } from 'src/app/service/util/global-info.service';
import { PostitService } from 'src/app/service/postit/postit.service';

describe('BoardNoteComponent', () => {
  let component: BoardNoteComponent;
  let fixture: ComponentFixture<BoardNoteComponent>;

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['showAlert']);
    const postitSpy = jasmine.createSpyObj('PostitService', ['updateNote', 'getNote']);

    TestBed.configureTestingModule({
      declarations: [BoardNoteComponent],
      providers: [
        MatDialog,
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        { provide: PostitService, useValue: postitSpy }
      ],
      imports: [MatIconModule, MatDialogModule, MatCardModule, MatMenuModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
