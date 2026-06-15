import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { VotingRadioButton } from '../components/voting-radio-button/voting-radio-button';
import { RestaurantRow } from '../components/restaurant-row/restaurant-row';

type TGroup = {
  favoriteRestaurants: Array<{
    id: string;
    name: string;
    url: string | null;
    dailyMenuUrl: string | null;
  }>;
};

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule, VotingRadioButton, RestaurantRow],
  templateUrl: './group-voting.html',
  styleUrl: './group-voting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupVoting implements OnInit {
  protected readonly group = signal<TGroup | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('groupId');

    if (groupId) {
      this.apiService.getGroupById(groupId).subscribe((group) => {
        this.group.set(group as TGroup);
      });
    }
  }
}
