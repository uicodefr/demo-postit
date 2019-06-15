import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { RestClientService } from '../utils/rest-client.service';

describe('UserService', () => {

  beforeEach(() => {
    const restClientSpy = jasmine.createSpyObj('RestClientService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: RestClientService, useValue: restClientSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
