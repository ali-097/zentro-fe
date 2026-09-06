import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = signal(false);
  constructor(private router: Router) {}

  isLoggedIn$ = toObservable(this._isLoggedIn);

  isLoggedIn() {
    return this._isLoggedIn.asReadonly();
  }

  async login(email: string, password: string): Promise<boolean> {
    //Simulating an API call for now
    if (email && password) {
      this._isLoggedIn.set(true);
      localStorage.setItem('zentro-auth', 'true');
      return true;
    }
    return false;
  }

  async register(email: string, password: string) {
    //Simulating an API call for now
    return true;
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('zentro-auth');
  }

  restoreSession() {
    if (localStorage.getItem('zentro-auth')) {
      this._isLoggedIn.set(true);
    }
  }
}
