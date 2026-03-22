import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNoteDialogComponent } from './edit-note-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { defaultNoteMock } from '@test/fixture/notes.fixture';
import { PostitNote } from '@app/model/postit/postit-note';

describe('EditNoteDialogComponent', () => {
  let component: EditNoteDialogComponent;
  let fixture: ComponentFixture<EditNoteDialogComponent>;
  let httpMock: HttpTestingController;
  const mockDialogRef = {
    close: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNoteDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { editedNote: defaultNoteMock() } },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show form with note data', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Edit Note');

    const titleInput = fixture.nativeElement.querySelector('input[data-testid="titleInput"]');
    expect(titleInput.placeholder).toBe('Title');
    expect(titleInput.value).toBe('Note Title');

    const messageInput = fixture.nativeElement.querySelector('textarea[data-testid="messageInput"]');
    expect(messageInput.placeholder).toBe('Message');
    expect(messageInput.value).toBe('Note Text Content');

    const cancelBtn = fixture.nativeElement.querySelector('button[data-testid="cancelBtn"]');
    expect(cancelBtn.textContent).toBe('Cancel');

    const saveBtn = fixture.nativeElement.querySelector('button[data-testid="saveBtn"]');
    expect(saveBtn.textContent).toBe('Save');
  });

  it('should update note with form data', () => {
    const titleInput = fixture.nativeElement.querySelector('input[data-testid="titleInput"]');
    titleInput.value = 'Title Changed';
    titleInput.dispatchEvent(new Event('input'));
    const messageInput = fixture.nativeElement.querySelector('textarea[data-testid="messageInput"]');
    messageInput.value = 'Text Content Changed';
    messageInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    const saveBtn = fixture.nativeElement.querySelector('button[data-testid="saveBtn"]');
    saveBtn.click();

    const req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('PATCH');
    const noteChanged = { id: 1, name: 'Title Changed', text: 'Text Content Changed' } as PostitNote;
    expect(req.request.body).toStrictEqual(noteChanged);
    req.flush(noteChanged);
    expect(mockDialogRef.close).toHaveBeenCalledWith(noteChanged);
  });
});
