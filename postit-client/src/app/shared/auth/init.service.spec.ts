import { TestBed } from '@angular/core/testing';

import { InitService } from './init.service';
import { RestClientService } from '../service/utils/rest-client.service';

describe('InitService', () => {

  beforeEach(() => {
    const restClientSpy = jasmine.createSpyObj('RestClientService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        { provide: RestClientService, useValue: restClientSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: InitService = TestBed.get(InitService);
    expect(service).toBeTruthy();
  });
});
