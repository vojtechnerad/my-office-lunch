import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLinkWithHref,
  RouterModule,
} from '@angular/router';
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
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmDialogImports, HlmDialogService } from '@spartan-ng/helm/dialog';

@Component({
  selector: 'mol-group-voting',
  imports: [
    CommonModule,
    NzModalModule,
    VotingRadioButton,
    RestaurantRow,
    HlmButtonImports,
    HlmBreadcrumbImports,
    HlmDialogImports,
    RouterModule,
  ],
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
  private readonly dialogService = inject(HlmDialogService);

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

          this.results.set(typedResults.length > 0 ? typedResults : null);
        });

        this.socketService
          .on('vote:updated-results')
          .subscribe(({ results }) => {
            const typedResults =
              results as VoteUpdatedResultsPayload['results'];

            this.results.set(typedResults.length > 0 ? typedResults : null);
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
    const dialogRef = this.dialogService.open(DailyMenuModal, {
      showCloseButton: true,
      context: {
        dailyMenuUrl: dailyMenuUrl,
      },
      contentClass: 'h-[90dvh] w-[90dvw]',
    });
    // const modal = this.modal.create({
    //   nzTitle: `Daily Menu for ${restaurantName}`,
    //   nzClosable: true,
    //   nzContent: DailyMenuModal,
    //   nzViewContainerRef: this.viewContainerRef,
    //   nzWidth: '90dvw',
    //   nzCentered: true,
    //   nzBodyStyle: {
    //     height: '90dvh',
    //     padding: '0',
    //   },
    //   nzFooter: null,
    //   nzData: {
    //     dailyMenuUrl,
    //   },
    // });
  }
}
