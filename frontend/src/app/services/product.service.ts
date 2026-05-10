import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { supabase } from '../core/supabase.client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  brand: string | null;
  image_url: string | null;
  sizes: string[];
  is_active: boolean;
  category_id: string;
  categories: { name: string; slug: string } | null;
}

export interface ProductsResponse {
  data: Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  getProducts(filters: ProductFilters = {}): Observable<ProductsResponse> {
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true)
      .order('name')
      .limit(filters.limit ?? 20);

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return { data: (data ?? []) as Product[] };
      })
    );
  }

  getProductBySlug(slug: string): Observable<Product> {
    return from(
      supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as Product;
      })
    );
  }
}