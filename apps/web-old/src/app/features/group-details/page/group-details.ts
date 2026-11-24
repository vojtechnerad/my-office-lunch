import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Blobatar } from '../../../shared/components/blobatar/blobatar';

@Component({
  selector: 'mol-group-details',
  imports: [NzButtonComponent, Blobatar],
  templateUrl: './group-details.html',
  styleUrl: './group-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetails implements OnInit {
  protected readonly group = signal<any | null>(null);

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

  protected joinGroup() {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (groupId) {
      this.apiService.joinGroup(groupId).subscribe(() => {
        // After joining the group, you might want to refresh the group details
        this.apiService.getGroupById(groupId).subscribe((group) => {
          this.group.set(group);
        });
      });
    }
  }
}
