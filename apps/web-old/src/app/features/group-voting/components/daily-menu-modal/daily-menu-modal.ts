import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'mol-daily-menu-modal',
  imports: [],
  templateUrl: './daily-menu-modal.html',
  styleUrl: './daily-menu-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyMenuModal {
  // readonly modalData = inject<{ dailyMenuUrl: string }>(NZ_MODAL_DATA);

  private readonly _dialogRef =
    inject<BrnDialogRef<{ dailyMenuUrl: string }>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{
    dailyMenuUrl: string;
  }>();

  private domSanitizer = inject(DomSanitizer);

  readonly sanitizedDailyMenuUrl =
    this.domSanitizer.bypassSecurityTrustResourceUrl(
      this._dialogContext.dailyMenuUrl,
    );
}
