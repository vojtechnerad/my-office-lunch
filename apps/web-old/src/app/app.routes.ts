import { Route } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.Auth),
  },
  // Protected routes
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      {
        path: 'group-voting/:groupId',
        loadComponent: () =>
          import('./features/group-voting/pages/group-voting').then(
            (m) => m.GroupVoting,
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/groups/groups').then((m) => m.Groups),
      },
      {
        path: 'groups/:groupId',
        loadComponent: () =>
          import('./features/group-details/page/group-details').then(
            (m) => m.GroupDetails,
          ),
      },
      {
        path: 'restaurants',
        loadComponent: () =>
          import('./features/restaurants/page/restaurants').then(
            (m) => m.Restaurants,
          ),
      },
      {
        path: 'restaurants/new',
        loadComponent: () =>
          import('./features/restaurant-details/page/restaurant-details').then(
            (m) => m.RestaurantDetails,
          ),
      },
      {
        path: 'restaurants/:restaurantId',
        loadComponent: () =>
          import('./features/restaurant-details/page/restaurant-details').then(
            (m) => m.RestaurantDetails,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user-profile/page/user-profile').then(
            (m) => m.UserProfile,
          ),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '/auth' },
];
