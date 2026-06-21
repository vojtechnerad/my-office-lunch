import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { TUserProfile } from '../types/user-profile.types';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mol-user-profile',
  imports: [NzButtonModule, NzListModule, NzTagModule, RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit {
  protected userData = signal<TUserProfile | null>(null);
  protected hasUserGroups = computed(() => {
    return (this.userData()?.userGroups.length ?? 0) > 0;
  });

  private apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getUserProfile().subscribe((profile) => {
      this.userData.set(profile);
    });
  }
}
