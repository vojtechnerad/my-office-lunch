import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

// Preferuji, Klidně, Nechci
type VotingOption = 'preferred' | 'neutral' | 'unwanted';

@Component({
  selector: 'mol-voting-radio-button',
  imports: [FormsModule, NzButtonModule, NzRadioModule, NzIconModule],
  templateUrl: './voting-radio-button.html',
  styleUrl: './voting-radio-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingRadioButton {
  protected readonly selectedValue = model<VotingOption | null>(null);

  protected deselectValue(): void {
    this.selectedValue.set(null);
  }
}
