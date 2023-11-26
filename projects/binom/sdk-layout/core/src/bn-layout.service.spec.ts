import { TestBed } from '@angular/core/testing';

import { BnLayoutService } from './bn-layout.service';

describe('BnLayoutService', () => {
  let service: BnLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
