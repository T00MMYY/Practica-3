import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import {Catalogo} from './components/catalogo/catalogo';
import {Contacto} from './components/contacto/contacto'

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'catalogo', component: Catalogo},
    {path: 'contacto', component: Contacto},
];
