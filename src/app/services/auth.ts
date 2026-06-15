import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // WritableSignal manages isLoggedIn reactively
  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.checkStatus();
  }

  checkStatus(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.isLoggedIn.set(sessionStorage.getItem('isLoggedIn') === 'true');
    }
  }

  login(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    this.isLoggedIn.set(true);
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('isLoggedIn');
    }
    this.isLoggedIn.set(false);
  }
}
