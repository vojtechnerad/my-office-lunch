import { Route } from '@angular/router';
import { Auth } from './features/auth/auth';
import { authGuard } from './core/auth/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Groups } from './features/groups/groups';
import { GroupVoting } from './features/group-voting/pages/group-voting';

export const appRoutes: Route[] = [
  { path: 'auth', component: Auth },
  // Protected routes
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      { path: 'group-voting/:groupId', component: GroupVoting },
      { path: 'groups', component: Groups },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '/auth' },
];
