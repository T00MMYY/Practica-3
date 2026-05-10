import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../../core/supabase.client';

interface OrderItem {
  id: string; quantity: number; unit_price: number; size: string | null;
  products: { name: string; image_url: string | null } | null;
}
interface Order {
  id: string; status: string; total_amount: number;
  shipping_address: string | null; notes: string | null;
  created_at: string; user_id: string;
  order_items: OrderItem[];
}

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos implements OnInit {
  orders = signal<Order[]>([])
  loading = signal(true)
  expandedId = signal<string | null>(null)

  readonly statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  readonly statusLabels: Record<string, string> = {
    pending: 'Pendiente', confirmed: 'Confirmado',
    shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado'
  }

  readonly statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  async ngOnInit() { await this.loadOrders() }

  async loadOrders() {
    this.loading.set(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .order('created_at', { ascending: false })
    this.orders.set((data ?? []) as Order[])
    this.loading.set(false)
  }

  toggleExpand(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id)
  }

  async changeStatus(order: Order, status: string) {
    await supabase.from('orders').update({ status }).eq('id', order.id)
    await this.loadOrders()
  }

  shortId(id: string) { return '#' + id.slice(0, 8).toUpperCase() }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}