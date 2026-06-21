import { Route } from '@angular/router';
import { Auth } from './features/auth/auth';
import { authGuard } from './core/auth/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Groups } from './features/groups/groups';
import { GroupVoting } from './features/group-voting/pages/group-voting';
import { Restaurants } from './features/restaurants/page/restaurants';
import { RestaurantDetails } from './features/restaurant-details/page/restaurant-details';
import { GroupDetails } from './features/group-details/page/group-details';
import { UserProfile } from './features/user-profile/page/user-profile';

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
      { path: 'groups/:groupId', component: GroupDetails },
      { path: 'restaurants', component: Restaurants },
      { path: 'restaurants/:restaurantId', component: RestaurantDetails },
      { path: 'profile', component: UserProfile },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '/auth' },
];
