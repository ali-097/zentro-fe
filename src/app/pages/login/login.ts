import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  error = '';
  constructor(private authService: AuthService, private router: Router) {}
  async onLogin() {
    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/groups']);
    } else {
      this.error = 'Invalid email or password';
    }
  }
}
