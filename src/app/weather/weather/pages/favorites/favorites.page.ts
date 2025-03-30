import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Location } from 'src/app/shared/models/location.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
    ],
  styleUrls: ['./favorites.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class FavoritesPage implements OnInit {
  favoriteLocations: Location[] = [];
  errorMessage: string | null = null;

  constructor(private favoriteService: FavoritesService, private router: Router,) {}

  loadFavorites() {
    try {
      this.favoriteLocations = this.favoriteService.getFavorites();
    } catch (error) {
      this.errorMessage = 'Could not load favorite cities.';
    }
  }
  
  ngOnInit(): void {
    this.loadFavorites();
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  removeFavorite(locationKey: string): void {
    this.favoriteService.removeFromFavorites(locationKey);
    this.loadFavorites();
  }
}
