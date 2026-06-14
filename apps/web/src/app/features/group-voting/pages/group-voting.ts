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

@Component({
  selector: 'mol-group-voting',
  imports: [CommonModule],
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
