import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;
  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  login(email: string, password: string) {
    //Simulating an API call for now
    if (email && password) {
      this._isLoggedIn = true;
      this.router.navigate(['/groups']);
    }
  }

  register(name: string, email: string, password: string) {
    //Simulating an API call for now
    if (email && password) {
      this._isLoggedIn = true;
      this.router.navigate(['/groups']);
    }
  }

  logout() {
    this._isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
