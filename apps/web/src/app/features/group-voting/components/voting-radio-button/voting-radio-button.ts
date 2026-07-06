import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
} from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleX,
  lucideMeh,
  lucideMinus,
  lucideStar,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';

// Preferuji, Klidně, Nechci
export type VotingOption = 'preferred' | 'neutral' | 'unwanted';

@Component({
  selector: 'mol-voting-radio-button',
  imports: [
    FormsModule,
    NzButtonModule,
    NzRadioModule,
    NzIconModule,
    HlmToggleGroupImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideThumbsUp,
      lucideMeh,
      lucideThumbsDown,
    }),
  ],
  templateUrl: './voting-radio-button.html',
  styleUrl: './voting-radio-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class VotingRadioButton {
  public valueChange = output<VotingOption | null>();

  protected readonly selectedValue = model<VotingOption | null>(null);

  handleRadioChange(value: VotingOption): void {
    this.valueChange.emit(value);
  }
}
