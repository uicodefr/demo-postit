import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorizeNoteDialogComponent } from './colorize-note-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ColorizeNoteDialogComponent', () => {
  let component: ColorizeNoteDialogComponent;
  let fixture: ComponentFixture<ColorizeNoteDialogComponent>;
  let httpMock: HttpTestingController;
  const mockDialogRef = {
    close: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorizeNoteDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: { noteId: 1 } },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorizeNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display choice of colors', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Change Color');
    const colorBtnList = fixture.nativeElement.querySelectorAll('button');
    expect(colorBtnList).toHaveLength(6);

    let i = 0;
    ['white', 'yellow', 'orange', 'blue', 'green', 'pink'].forEach((color) => {
      expect(colorBtnList[i].className).toContain(color);
      expect(colorBtnList[i].textContent).toMatch(new RegExp(color, 'i'));
      i++;
    });
  });

  it('should path note with selected color', () => {
    const colorBtnList = fixture.nativeElement.querySelectorAll('button');
    const colorGreenBtn = colorBtnList[4];
    expect(colorGreenBtn.textContent).toContain('Green');

    colorGreenBtn.click();

    const req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toStrictEqual({
      color: 'green',
      id: 1,
    });
    req.flush({});
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
