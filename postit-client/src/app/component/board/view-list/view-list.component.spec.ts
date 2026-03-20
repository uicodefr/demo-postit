import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewListComponent } from './view-list.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { provideRouter } from '@angular/router';

describe('ViewListComponent', () => {
  let component: ViewListComponent;
  let fixture: ComponentFixture<ViewListComponent>;

  beforeEach(async () => {
    const mockBottomSheetRef = {
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ViewListComponent],
      providers: [
        provideRouter([]),
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
