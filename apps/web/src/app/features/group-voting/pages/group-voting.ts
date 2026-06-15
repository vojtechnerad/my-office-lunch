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

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule, VotingRadioButton],
  templateUrl: './group-voting.html',
  styleUrl: './group-voting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupVoting implements OnInit {
  protected readonly group = signal<object | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('groupId');

    if (groupId) {
      this.apiService.getGroupById(groupId).subscribe((group) => {
        this.group.set(group);
      });
    }
  }
}
