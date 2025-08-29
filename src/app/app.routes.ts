import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Home',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    title: 'Register',
  },
  {
    path: 'groups',
    loadComponent: () => import('./pages/groups/groups').then((m) => m.Groups),
    canActivate: [authGuard],
    title: 'Groups',
  },
  {
    path: 'group/:id',
    loadComponent: () => import('./pages/group-detail/group-detail').then((m) => m.GroupDetail),
    canActivate: [authGuard],
    title: 'Group Detail',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
