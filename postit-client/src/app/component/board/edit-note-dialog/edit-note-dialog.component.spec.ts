import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNoteDialogComponent } from './edit-note-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PostitService } from 'src/app/service/postit/postit.service';
import { FormsModule } from '@angular/forms';

describe('EditNoteDialogComponent', () => {
  let component: EditNoteDialogComponent;
  let fixture: ComponentFixture<EditNoteDialogComponent>;

  beforeEach(async(() => {
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    const postitSpy = jasmine.createSpyObj('PostitService', ['updateNote']);

    TestBed.configureTestingModule({
      declarations: [EditNoteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: PostitService, useValue: postitSpy }
      ],
      imports: [FormsModule, MatDialogModule, MatInputModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
