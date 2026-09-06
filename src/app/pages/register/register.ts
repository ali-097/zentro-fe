import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'z-register',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h2 class="text-2xl font-bold mb-4">Register</h2>
      <form (ngSubmit)="onSubmit()" #regForm="ngForm">
        <input
          type="text"
          [(ngModel)]="name"
          name="name"
          placeholder="Name"
          class="w-full mb-3 p-2 border rounded"
          required
        />

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

        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded">Sign up</button>
      </form>
    </div>
  `,
})
export class Register {
  name = '';
  email = '';
  password = '';

  private readonly auth = inject(AuthService);

  onSubmit() {
    this.auth.register(this.name, this.email, this.password);
  }
}
