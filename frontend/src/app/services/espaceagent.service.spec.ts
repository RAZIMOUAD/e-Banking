import { TestBed } from '@angular/core/testing';

import { EspaceagentService } from './espaceagent.service';

describe('EspaceagentService', () => {
  let service: EspaceagentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaceagentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
