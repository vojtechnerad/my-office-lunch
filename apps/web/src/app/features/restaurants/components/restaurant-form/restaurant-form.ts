import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'mol-restaurant-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzUploadModule,
  ],
  templateUrl: './restaurant-form.html',
  styleUrl: './restaurant-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantForm {
  protected restarantForm =
    viewChild<ElementRef<HTMLFormElement>>('restarantForm');

  protected avatarUrl = signal<string | null>(null); // Pro zobrazení náhledu obrázku

  private readonly fb = inject(FormBuilder);

  protected readonly validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    url: this.fb.control(''),
    dailyMenuUrl: this.fb.control(''),
    icon: this.fb.control<string | null>(null, [Validators.required]),
  });

  public submitForm(): {
    name: string;
    url: string;
    dailyMenuUrl: string;
    icon: string | null;
  } | null {
    if (this.validateForm.valid) {
      return {
        name: this.validateForm.value.name ?? '',
        url: this.validateForm.value.url ?? '',
        dailyMenuUrl: this.validateForm.value.dailyMenuUrl ?? '',
        icon: this.validateForm.value.icon ?? null,
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

  protected beforeUpload = (file: NzUploadFile) => {
    // 1. Validace typu
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      // this.msg.error('Můžeš nahrávat pouze JPG/PNG soubory!');
      return false;
    }

    // 2. Validace velikosti (např. max 2MB)
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      // this.msg.error('Obrázek musí být menší než 2MB!');
      return false;
    }

    // 4. Vytvoření Base64 náhledu (aby uživatel viděl, co vybral)
    this.getBase64(file as any, (img: string) => {
      this.avatarUrl.set(img);

      // 3. Propojení s FormBuilder modelem
      // Uložíme samotný soubor do formuláře, aby byl připraven na submit
      this.validateForm.patchValue({ icon: img });
      this.validateForm.get('icon')?.markAsDirty();
    });

    // Vrátíme false, čímž řekneme NG-ZORRO, ať soubor nenahrává samo.
    // Nahrání provedeme my při odeslání celého formuláře.
    return false;
  };

  // Pomocná metoda pro konverzi souboru na Base64 string
  private getBase64(file: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(file);
  }
}
