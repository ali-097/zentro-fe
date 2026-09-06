import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class Register {
  email = '';
  confirmPassword = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    const success = await this.auth.register(this.email, this.password);
    if (success) {
      this.router.navigate(['/groups']);
    } else {
      this.error = 'Registration failed';
    }
  }
}
