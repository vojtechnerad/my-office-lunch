import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMenuModule } from 'ng-zorro-antd/menu';

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
export class MainLayout {
  private authService = inject(AuthService);
  protected signOut(): void {
    this.authService.signOut();
  }
}
