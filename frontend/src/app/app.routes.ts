import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import {Catalogo} from './components/catalogo/catalogo';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'catalogo', component: Catalogo},
];
