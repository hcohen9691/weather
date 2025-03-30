import { Injectable } from '@angular/core';
import { Location } from 'src/app/shared/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: Location[] = [];

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favorites');
    this.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  addToFavorites(location: Location): void {
    if (!this.favorites.some(fav => fav.Key === location.Key)) {
      this.favorites.push(location);
      this.saveFavorites();
    }
  }

  removeFromFavorites(locationKey: string): void {
    this.favorites = this.favorites.filter(fav => fav.Key !== locationKey);
    this.saveFavorites();
  }

  getFavorites(): Location[] {
    try {
      return this.favorites;
    } catch (error) {
      throw(error);
    }
  }

  isFavorite(locationKey: string): boolean {
    return this.favorites.some(fav => fav.Key === locationKey);
  }
}
