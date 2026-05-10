import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../../core/supabase.client';

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; stock: number; brand: string | null; image_url: string | null;
  sizes: string[]; is_active: boolean; category_id: string;
  categories: { name: string } | null;
}

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos implements OnInit {
  products = signal<Product[]>([])
  categories = signal<Category[]>([])
  loading = signal(true)
  showModal = signal(false)
  editingProduct = signal<Product | null>(null)
  deletingId = signal<string | null>(null)

  form = {
    name: '', slug: '', description: '', price: 0, stock: 0,
    brand: '', image_url: '', sizes: '', category_id: '', is_active: true
  }

  async ngOnInit() {
    await Promise.all([this.loadProducts(), this.loadCategories()])
  }

  async loadProducts() {
    this.loading.set(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('name')
    this.products.set((data ?? []) as Product[])
    this.loading.set(false)
  }

  async loadCategories() {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    this.categories.set(data ?? [])
  }

  openNew() {
    this.editingProduct.set(null)
    this.form = { name: '', slug: '', description: '', price: 0, stock: 0, brand: '', image_url: '', sizes: '', category_id: '', is_active: true }
    this.showModal.set(true)
  }

  openEdit(p: Product) {
    this.editingProduct.set(p)
    this.form = {
      name: p.name, slug: p.slug, description: p.description ?? '',
      price: p.price, stock: p.stock, brand: p.brand ?? '',
      image_url: p.image_url ?? '', sizes: (p.sizes ?? []).join(', '),
      category_id: p.category_id, is_active: p.is_active
    }
    this.showModal.set(true)
  }

  generateSlug() {
    this.form.slug = this.form.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async save() {
    const sizes = this.form.sizes.split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      name: this.form.name, slug: this.form.slug,
      description: this.form.description || null,
      price: this.form.price, stock: this.form.stock,
      brand: this.form.brand || null,
      image_url: this.form.image_url || null,
      sizes, category_id: this.form.category_id,
      is_active: this.form.is_active
    }

    const editing = this.editingProduct()
    
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    this.showModal.set(false)
    await this.loadProducts()
  }

  async confirmDelete(id: string) {
    if (!confirm('¿Eliminar este producto? Se desactivará del catálogo.')) return
    await supabase.from('products').update({ is_active: false }).eq('id', id)
    await this.loadProducts()
  }

  closeModal() { this.showModal.set(false) }
}