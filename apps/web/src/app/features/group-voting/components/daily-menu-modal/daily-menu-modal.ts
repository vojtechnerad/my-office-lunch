import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'mol-daily-menu-modal',
  imports: [],
  templateUrl: './daily-menu-modal.html',
  styleUrl: './daily-menu-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyMenuModal {
  readonly modalData = inject<{ dailyMenuUrl: string }>(NZ_MODAL_DATA);

  private domSanitizer = inject(DomSanitizer);

  readonly sanitizedDailyMenuUrl =
    this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.modalData.dailyMenuUrl,
    );
}
