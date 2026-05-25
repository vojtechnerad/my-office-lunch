import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'mol-auth',
  imports: [FormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth {
  private authService = inject(AuthService);

  protected readonly email = signal('');
  protected readonly password = signal('');

  protected signIn(): void {
    this.authService
      .signIn(this.email(), this.password())
      .subscribe((response) => {
        console.log(response);
      });
  }
}
