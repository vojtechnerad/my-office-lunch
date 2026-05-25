import { Route } from '@angular/router';
import { Auth } from './features/auth/auth';
import { authGuard } from './core/auth/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Groups } from './features/groups/groups';

export const appRoutes: Route[] = [
  { path: 'auth', component: Auth },
  // Protected routes
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      {
        path: 'groups',
        component: Groups,
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '/auth' },
];
