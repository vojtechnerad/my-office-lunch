import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'mol-main-layout',
  imports: [
    RouterOutlet,
    NzButtonModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzMenuModule,
    RouterModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements OnInit {
  protected myGroups = signal<Array<{ id: string; name: string }>>([]);

  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  protected signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    this.apiService.myGroups().subscribe((groups) => {
      this.myGroups.set(groups);
    });
  }
}
