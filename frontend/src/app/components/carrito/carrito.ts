import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../../core/supabase.client';
import { AuthService } from '../../services/auth.service';

interface CartItem {
  id: string; name: string; price: number;
  image_url: string | null; size: string; quantity: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit, OnDestroy {
  items = signal<CartItem[]>([])
  shippingAddress = ''
  notes = ''
  loading = signal(false)
  ordered = signal(false)
  private cartListener = () => this.loadCart()

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadCart()
    window.addEventListener('cart-updated', this.cartListener)
  }

  ngOnDestroy() {
    window.removeEventListener('cart-updated', this.cartListener)
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]')
    this.items.set(cart)
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return
    const cart = this.items().map(i =>
      i.id === item.id && i.size === item.size ? { ...i, quantity } : i
    )
    this.items.set(cart)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  removeItem(item: CartItem) {
    const cart = this.items().filter(i => !(i.id === item.id && i.size === item.size))
    this.items.set(cart)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  get total() {
    return this.items().reduce((acc, i) => acc + i.price * i.quantity, 0)
  }

  get totalItems() {
    return this.items().reduce((acc, i) => acc + i.quantity, 0)
  }

  async checkout() {
    const user = this.authService.user()
    if (!user || !this.items().length) return

    this.loading.set(true)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_amount: this.total,
        shipping_address: this.shippingAddress || null,
        notes: this.notes || null,
      })
      .select()
      .single()

    if (error || !order) {
      this.loading.set(false)
      return
    }

    const orderItems = this.items().map(i => ({
      order_id: order.id,
      product_id: i.id,
      quantity: i.quantity,
      unit_price: i.price,
      size: i.size,
    }))

    await supabase.from('order_items').insert(orderItems)

    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cart-updated'))
    this.items.set([])
    this.loading.set(false)
    this.ordered.set(true)
  }
}