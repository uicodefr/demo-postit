import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorizeNoteDialogComponent } from './colorize-note-dialog.component';

describe('ColorizeNoteDialogComponent', () => {
  let component: ColorizeNoteDialogComponent;
  let fixture: ComponentFixture<ColorizeNoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorizeNoteDialogComponent ]
    })
    .compileComponents();
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
