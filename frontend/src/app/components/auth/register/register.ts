import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = ''
  email = ''
  password = ''
  error = ''
  loading = false

  constructor(private authService: AuthService, private router: Router) {}

  async registerUser() {
    this.error = ''
    this.loading = true

    try {
      await this.authService.register(this.fullName, this.email, this.password)
      await this.router.navigate(['/'])
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error al crear la cuenta.'
    } finally {
      this.loading = false
    }
  }
}

