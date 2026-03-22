import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComponent } from './info.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show info', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="clientInfo"] h1').textContent).toContain('Client Info');
    expect(fixture.nativeElement.querySelector('[data-testid="clientInfo"] pre').textContent).toContain(
      '"name": "Postit Client",',
    );

    const req = httpMock.expectOne('/api/actuator/info');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'Postit Server', version: 'test' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="serverInfo"] h1').textContent).toContain('Server Info');
    expect(fixture.nativeElement.querySelector('[data-testid="serverInfo"] pre').textContent).toContain(
      '"name": "Postit Server",',
    );
  });
});
