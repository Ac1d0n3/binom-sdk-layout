import { CanActivateFn } from '@angular/router';

export const bnLayoutNotOnPhoneGuard: CanActivateFn = (route, state) => {
  return true;
};
