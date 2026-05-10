import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = ''
  password = ''
  error = ''
  loading = false

  constructor(private authService: AuthService, private router: Router) {}

  async loginUser() {
    this.error = ''
    this.loading = true

    try {
      await this.authService.login(this.email, this.password)
      await this.router.navigate(['/'])
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error al iniciar sesión.'
    } finally {
      this.loading = false
    }
  }
}

