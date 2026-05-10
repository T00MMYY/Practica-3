import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalogo } from './components/catalogo/catalogo';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { AdminProductos } from './components/admin/admin-productos/admin-productos'
import { AdminPedidos } from './components/admin/admin-pedidos/admin-pedidos'
import { MisPedidos } from './components/mis-pedidos/mis-pedidos'
import { authGuard } from './guards/auth.guard'
import { adminGuard } from './guards/admin.guard'
import { ProductoDetalle } from './components/producto-detalle/producto-detalle';
import { Carrito } from './components/carrito/carrito';

export const routes: Routes = [
{ path: '', component: Home },
  { path: 'catalogo', component: Catalogo },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'mis-pedidos', component: MisPedidos, canActivate: [authGuard] },
  { path: 'admin/productos', component: AdminProductos, canActivate: [authGuard, adminGuard] },
  { path: 'admin/pedidos', component: AdminPedidos, canActivate: [authGuard, adminGuard] },
  { path: 'producto/:slug', component: ProductoDetalle },
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
]