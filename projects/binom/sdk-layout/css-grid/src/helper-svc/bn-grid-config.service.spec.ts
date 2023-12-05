import { TestBed } from '@angular/core/testing';

import { BnGridConfigService } from './bn-grid-config.service';

describe('BnGridConfigService', () => {
  let service: BnGridConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnGridConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
