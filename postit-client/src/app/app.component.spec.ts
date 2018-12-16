import { TestBed, async } from '@angular/core/testing';
import { MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { GlobalInfoService } from './shared/service/utils/global-info.service';
import { GlobalService } from './shared/service/global/global.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['getLoaderObservable']);
    globalInfoSpy.getLoaderObservable.and.returnValue(of());

    const globalSpy = jasmine.createSpyObj('GlobalService', ['getStatus', 'launchCountLikeTimer', 'getCountLikeObservable', 'addLike']);
    globalSpy.getStatus.and.returnValue(Promise.resolve({ status: 'true' }));
    globalSpy.getCountLikeObservable.and.returnValue(of());

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        { provide: GlobalService, useValue: globalSpy }
      ],
      imports: [
        MatToolbarModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have availableApp = true', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.availableApp).toEqual(true);

    fixture.whenStable().then(() => {
      expect(app.availableApp).toEqual(true);
    });
  }));

  it('should render a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Post-It');
  }));

});
