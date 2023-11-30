import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bnNotOnPhoneGuard } from './bn-not-on-phone.guard';

describe('bnNotOnPhoneGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => bnNotOnPhoneGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
