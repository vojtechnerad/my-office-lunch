import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChefHat,
  lucideEllipsisVertical,
  lucideExternalLink,
  lucideGlobe,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'mol-restaurant-row',
  imports: [HlmButtonImports, HlmDropdownMenuImports, NgIcon],
  providers: [
    provideIcons({
      lucideChefHat,
      lucideGlobe,
      lucideEllipsisVertical,
      lucideExternalLink,
    }),
  ],
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
    icon: string | null;
  }>();
}
