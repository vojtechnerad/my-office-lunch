import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';
import { RestaurantForm } from '../components/restaurant-form/restaurant-form';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'mol-restaurants',
  imports: [RouterModule, NzButtonModule, NzListModule, NzModalModule],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Restaurants implements OnInit {
  protected readonly restaurants = signal<Array<{ id: string; name: string }>>(
    [],
  );
  private readonly isNewRestaurantCreating = signal(false);

  private readonly apiService = inject(ApiService);
  private readonly modalService = inject(NzModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.apiService.getRestaurants().subscribe((restaurants) => {
      this.restaurants.set(restaurants);
    });
  }

  protected handleClickNewRestaurant(): void {
    const modal = this.modalService.create<RestaurantForm>({
      nzTitle: 'Add New Restaurant',
      nzContent: RestaurantForm,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: [
        {
          label: 'Save',
          type: 'primary',
          loading: this.isNewRestaurantCreating(),
          onClick: (componentInstance) => {
            const formData = componentInstance?.submitForm();

            if (formData) {
              this.isNewRestaurantCreating.set(true);
              this.apiService.createRestaurant(formData).subscribe({
                next: () => {
                  this.apiService.getRestaurants().subscribe((restaurants) => {
                    this.restaurants.set(restaurants);
                  });
                  this.isNewRestaurantCreating.set(false);
                  modal.close();
                },
                error: () => {
                  this.isNewRestaurantCreating.set(false);
                  modal.close();
                },
              });
            }
          },
        },
      ],
    });
  }
}
