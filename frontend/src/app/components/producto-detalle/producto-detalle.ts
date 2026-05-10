import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { supabase } from '../../core/supabase.client';
import { AuthService } from '../../services/auth.service';

interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; stock: number; brand: string | null; image_url: string | null;
  sizes: string[]; category_id: string;
  categories: { name: string; slug: string } | null;
}

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle implements OnInit {
  product = signal<Product | null>(null)
  loading = signal(true)
  selectedSize = signal<string | null>(null)
  quantity = signal(1)
  addedToCart = signal(false)

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')
    if (!slug) return

    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    this.product.set(data as Product)
    this.loading.set(false)
  }

  selectSize(size: string) { this.selectedSize.set(size) }

  increment() {
    const p = this.product()
    if (p && this.quantity() < p.stock) this.quantity.update(q => q + 1)
  }

  decrement() {
    if (this.quantity() > 1) this.quantity.update(q => q - 1)
  }

  addToCart() {
    const p = this.product()
    if (!p || !this.selectedSize()) return

    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]')
    const existing = cart.find((i: any) => i.id === p.id && i.size === this.selectedSize())

    if (existing) {
      existing.quantity += this.quantity()
    } else {
      cart.push({
        id: p.id, name: p.name, price: p.price,
        image_url: p.image_url, size: this.selectedSize(),
        quantity: this.quantity()
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    this.addedToCart.set(true)
    setTimeout(() => this.addedToCart.set(false), 2000)
  }
}