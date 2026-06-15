import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'mol-restaurant-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './restaurant-form.html',
  styleUrl: './restaurant-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantForm {
  protected restarantForm =
    viewChild<ElementRef<HTMLFormElement>>('restarantForm');

  private readonly fb = inject(FormBuilder);

  protected readonly validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    url: this.fb.control(''),
    dailyMenuUrl: this.fb.control(''),
  });

  public submitForm(): {
    name: string;
    url: string;
    dailyMenuUrl: string;
  } | null {
    if (this.validateForm.valid) {
      return {
        name: this.validateForm.value.name ?? '',
        url: this.validateForm.value.url ?? '',
        dailyMenuUrl: this.validateForm.value.dailyMenuUrl ?? '',
      };
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return null;
    }
  }
}
