import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from '@app/service/auth/auth.guard';
import { AuthService } from '@app/service/auth/auth.service';
import { vi } from 'vitest';

describe('AuthGuard', () => {
  const authServiceMock = {
    redirectToLogin: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthService, useValue: authServiceMock }],
    });
  });

  it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
