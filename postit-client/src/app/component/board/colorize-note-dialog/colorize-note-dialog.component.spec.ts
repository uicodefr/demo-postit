import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorizeNoteDialogComponent } from './colorize-note-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostitService } from 'src/app/service/postit/postit.service';

describe('ColorizeNoteDialogComponent', () => {
  let component: ColorizeNoteDialogComponent;
  let fixture: ComponentFixture<ColorizeNoteDialogComponent>;

  beforeEach(async(() => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    const postitSpy = jasmine.createSpyObj('PostitService', ['updateNote']);

    TestBed.configureTestingModule({
      declarations: [ColorizeNoteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: PostitService, useValue: postitSpy }
      ],
      imports: [MatDialogModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorizeNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
