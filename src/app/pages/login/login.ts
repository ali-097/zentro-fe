import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'z-login',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          placeholder="Password"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  `,
})
export class Login {
  email = '';
  password = '';
  private readonly authService = inject(AuthService);
  onSubmit() {
    this.authService.login(this.email, this.password);
  }
}
