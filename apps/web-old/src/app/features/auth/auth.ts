import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'mol-auth',
  imports: [FormsModule, HlmButton, HlmInput, HlmSpinnerImports, NgIcon],
  providers: [
    provideIcons({
      lucideEye,
      lucideEyeOff,
    }),
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid place-items-center h-screen',
  },
})
export class Auth {
  private authService = inject(AuthService);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isPasswordVisible = signal(false);
  protected readonly isSigningIn = signal(false);

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  protected signIn(): void {
    this.isSigningIn.set(true);
    this.authService.signIn(this.email(), this.password()).subscribe({
      next: () => {
        this.isSigningIn.set(false);
      },
      error: (err) => {
        this.isSigningIn.set(false);
        console.log('err');
        toast.error('An error occurred while signing in', {
          description: err.message,
        });
      },
    });
  }
}
