import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mol-restaurants',
  imports: [],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Restaurants {}
