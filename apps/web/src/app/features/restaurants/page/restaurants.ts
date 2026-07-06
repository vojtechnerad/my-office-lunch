import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { RouterModule } from '@angular/router';
import { ListRestaurantsResponse } from 'contracts/restaurants.contracts';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'mol-restaurants',
  imports: [RouterModule, HlmCardImports, HlmItemImports, NgIcon],
  providers: [
    provideIcons({
      lucideChevronRight,
    }),
  ],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Restaurants implements OnInit {
  protected readonly restaurants = signal<ListRestaurantsResponse>([]);
  private readonly isNewRestaurantCreating = signal(false);

  private readonly apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getRestaurants().subscribe((restaurants) => {
      this.restaurants.set(restaurants);
    });
  }

  // protected handleClickNewRestaurant(): void {
  //   const modal = this.modalService.create<RestaurantForm>({
  //     nzTitle: 'Add New Restaurant',
  //     nzContent: RestaurantForm,
  //     nzViewContainerRef: this.viewContainerRef,
  //     nzFooter: [
  //       {
  //         label: 'Save',
  //         type: 'primary',
  //         loading: this.isNewRestaurantCreating(),
  //         onClick: (componentInstance) => {
  //           const formData = componentInstance?.submitForm();

  //           if (formData) {
  //             this.isNewRestaurantCreating.set(true);
  //             this.apiService.createRestaurant(formData).subscribe({
  //               next: () => {
  //                 this.apiService.getRestaurants().subscribe((restaurants) => {
  //                   this.restaurants.set(restaurants);
  //                 });
  //                 this.isNewRestaurantCreating.set(false);
  //                 modal.close();
  //               },
  //               error: () => {
  //                 this.isNewRestaurantCreating.set(false);
  //                 modal.close();
  //               },
  //             });
  //           }
  //         },
  //       },
  //     ],
  //   });
  // }
}
