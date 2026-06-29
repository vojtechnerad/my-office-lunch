import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronsUpDown,
  lucideCookingPot,
  lucideHouse,
  lucideInbox,
  lucideLogOut,
  lucideSearch,
  lucideSettings,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
  selector: 'mol-main-layout',
  imports: [
    RouterOutlet,
    RouterModule,
    HlmSidebarImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    NgIcon,
    HlmSkeletonImports,
  ],
  providers: [
    provideIcons({
      lucideCookingPot,
      lucideHouse,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
      lucideUser,
      lucideUsers,
      lucideChevronsUpDown,
      lucideLogOut,
    }),
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements OnInit {
  protected myGroups = signal<Array<{ id: string; name: string }>>([]);
  protected isGroupsLoading = signal(true);
  protected name = localStorage.getItem('name') || '';

  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  protected signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    this.apiService.myGroups().subscribe((groups) => {
      this.myGroups.set(groups);
      this.isGroupsLoading.set(false);
    });
  }
}
