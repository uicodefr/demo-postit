import { TestBed, inject } from '@angular/core/testing';

import { GlobalService } from './global.service';
import { RestClientService } from '../utils/rest-client.service';

describe('GlobalService', () => {
  beforeEach(() => {
    const restClientSpy = jasmine.createSpyObj('RestClientService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        { provide: RestClientService, useValue: restClientSpy }
      ]
    });
  });

  it('should be created', inject([GlobalService], (service: GlobalService) => {
    expect(service).toBeTruthy();
  }));
});
