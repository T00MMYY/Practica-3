import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productosDestacados = [
    { nombre: 'AirStride Pro', categoria: 'Running', precio: 129.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { nombre: 'AirStride Pro', categoria: 'Running', precio: 129.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { nombre: 'AirStride Pro', categoria: 'Running', precio: 129.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { nombre: 'AirStride Pro', categoria: 'Running', precio: 129.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }
  ];
}