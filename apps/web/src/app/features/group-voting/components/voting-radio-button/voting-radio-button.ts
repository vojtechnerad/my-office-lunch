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

// Preferuji, Klidně, Nechci
export type VotingOption = 'preferred' | 'neutral' | 'unwanted';

@Component({
  selector: 'mol-voting-radio-button',
  imports: [FormsModule, NzButtonModule, NzRadioModule, NzIconModule],
  templateUrl: './voting-radio-button.html',
  styleUrl: './voting-radio-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingRadioButton {
  public valueChange = output<VotingOption | null>();

  protected readonly selectedValue = model<VotingOption | null>(null);

  protected deselectValue(): void {
    this.selectedValue.set(null);
    this.valueChange.emit(null);
  }

  handleRadioChange(value: VotingOption): void {
    this.valueChange.emit(value);
  }
}
