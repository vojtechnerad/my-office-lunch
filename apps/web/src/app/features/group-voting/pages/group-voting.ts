import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
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
import {
  GroupJoinedPayload,
  RestaurantVotingResult,
  VoteUpdatedResultsPayload,
} from 'contracts/websockets.contracts';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { DailyMenuModal } from '../components/daily-menu-modal/daily-menu-modal';

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule, NzModalModule, VotingRadioButton, RestaurantRow],
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
  private readonly modal = inject(NzModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);

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

        this.socketService.on('group:joined').subscribe(({ results }) => {
          const typedResults = results as GroupJoinedPayload['results'];

          this.results.set(typedResults);
        });

        this.socketService
          .on('vote:updated-results')
          .subscribe(({ results }) => {
            const typedResults =
              results as VoteUpdatedResultsPayload['results'];

            this.results.set(typedResults);
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

  protected handleOpenDailyMenuModal(
    restaurantName: string,
    dailyMenuUrl: string,
  ): void {
    const modal = this.modal.create({
      nzTitle: `Daily Menu for ${restaurantName}`,
      nzClosable: true,
      nzContent: DailyMenuModal,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '90dvw',
      nzCentered: true,
      nzBodyStyle: {
        height: '90dvh',
        padding: '0',
      },
      nzFooter: null,
      nzData: {
        dailyMenuUrl,
      },
    });
  }
}
