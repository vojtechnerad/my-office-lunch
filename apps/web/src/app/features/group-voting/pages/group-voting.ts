import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import {
  VotingOption,
  VotingRadioButton,
} from '../components/voting-radio-button/voting-radio-button';
import { RestaurantRow } from '../components/restaurant-row/restaurant-row';
import { SocketService } from '../services/socket-service';
import { GroupDetails } from '../../../shared/types/group.types';
import { RestaurantVotingResult } from 'contracts/sockets.contracts';

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule, VotingRadioButton, RestaurantRow],
  templateUrl: './group-voting.html',
  styleUrl: './group-voting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupVoting implements OnInit {
  protected readonly group = signal<GroupDetails | null>(null);
  protected readonly groupId = signal<string | null>(null);
  protected readonly results = signal<Array<RestaurantVotingResult> | null>(
    null,
  );

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly socketService = inject(SocketService);

  constructor() {
    effect((onCleanup) => {
      const groupId = this.groupId();
      if (!groupId) return;

      this.apiService.getGroupById(groupId).subscribe((group) => {
        this.group.set(group);
      });

      const token = localStorage.getItem('token');
      if (token) {
        this.socketService.connect(token);
        this.socketService.emit('group:join', { groupId });

        this.socketService
          .on<{ results: Array<RestaurantVotingResult> }>('group:joined')
          .subscribe(({ results }) => {
            this.results.set(results);
          });

        this.socketService
          .on<{
            results: Array<RestaurantVotingResult>;
          }>('vote:updated-results')
          .subscribe(({ results }) => {
            this.results.set(results);
          });
      }

      onCleanup(() => {
        this.socketService.disconnect();
        this.group.set(null);
        this.results.set(null);
      });
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      this.groupId.set(groupId);
    });
  }

  protected handleVoteChange(vote: VotingOption | null, restaurantId: string) {
    const groupId = this.groupId();
    if (groupId) {
      this.socketService.emit('vote:change', {
        groupId,
        restaurantId,
        vote,
      });
    }
  }
}
