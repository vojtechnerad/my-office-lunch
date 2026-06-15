import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'mol-restaurant-row',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './restaurant-row.html',
  styleUrl: './restaurant-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantRow {
  public readonly restaurant = input.required<{
    id: string;
    name: string;
    url: string | null;
    dailyMenuUrl: string | null;
  }>();
}
