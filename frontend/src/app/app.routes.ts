import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalogo } from './components/catalogo/catalogo';
import { Contacto } from './components/contacto/contacto';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'catalogo', component: Catalogo },
    { path: 'contacto', component: Contacto },
    { path: 'login', component: Login },
    { path: 'register', component: Register }
];
