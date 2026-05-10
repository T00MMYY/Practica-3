import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  cartCount = signal(0)
  private cartListener = () => this.updateCartCount()

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateCartCount()
    window.addEventListener('cart-updated', this.cartListener)
  }

  ngOnDestroy() {
    window.removeEventListener('cart-updated', this.cartListener)
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]')
    this.cartCount.set(cart.reduce((acc: number, i: any) => acc + i.quantity, 0))
  }

  async logout() {
    await this.authService.logout()
    await this.router.navigate(['/login'])
  }
}