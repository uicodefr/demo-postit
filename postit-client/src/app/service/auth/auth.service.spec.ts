import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
    const userSpy = jasmine.createSpyObj('PostitService', ['getUserList']);
    userSpy.getUserList.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
