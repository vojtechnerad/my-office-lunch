import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { ApiService } from '../../core/services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mol-groups',
  imports: [RouterModule, NzListModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Groups implements OnInit {
  private readonly apiService = inject(ApiService);
  protected groups = signal<any[] | undefined>(undefined);

  ngOnInit() {
    this.apiService.getGroups().subscribe((groups) => {
      this.groups.set(groups as any);
    });
  }
}
