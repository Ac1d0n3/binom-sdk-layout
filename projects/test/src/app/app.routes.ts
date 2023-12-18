import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent:  () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'nested',
        loadComponent:  () => import('./nested-grid/nested-grid.component').then(m => m.NestedGridComponent)
    },
    {
        path: 'inner',
        loadComponent:  () => import('./inner/inner.component').then(m => m.InnerComponent)
    },
];
