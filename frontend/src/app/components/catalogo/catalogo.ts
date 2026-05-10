import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  products = signal<Product[]>([]);
  loading = signal(true);
  search = signal('');
  error = signal('');

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set('');

    this.productService.getProducts({ search: this.search() || undefined, limit: 20 }).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  searchProducts() {
    this.loadProducts();
  }
}
