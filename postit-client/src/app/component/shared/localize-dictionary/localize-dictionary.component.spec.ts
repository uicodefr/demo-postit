import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizeDictionaryComponent } from './localize-dictionary.component';

describe('LocalizeDictionaryComponent', () => {
  let component: LocalizeDictionaryComponent;
  let fixture: ComponentFixture<LocalizeDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizeDictionaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizeDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
