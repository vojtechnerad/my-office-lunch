import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { VotingWebSocketService } from '../services/voting-web-socket-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule],
  templateUrl: './group-voting.html',
  styleUrl: './group-voting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupVoting implements OnInit, OnDestroy {
  protected readonly group = signal<object | null>(null);
  protected subscription?: Subscription;

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly votingService = inject(VotingWebSocketService);

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('groupId');

    if (groupId) {
      this.apiService.getGroupById(groupId).subscribe((group) => {
        this.group.set(group);
      });

      this.subscription = this.votingService.connect(groupId).subscribe({
        next: (msg) => console.log('Received message:', msg),
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket connection closed'),
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.votingService.disconnect();
  }
}
