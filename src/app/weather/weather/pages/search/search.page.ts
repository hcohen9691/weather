import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { Location } from 'src/app/shared/models/location.model';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast, DailyForecast } from 'src/app/shared/models/forecast.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AiService } from 'src/app/core/services/ai.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  animations: [
    trigger('fadeInSlideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SearchPage implements OnInit, OnDestroy  {
  searchText = 'Tel Aviv';
  filteredLocations: Location[] = [];
  currentWeather: CurrentWeather | null = null;
  forecastData: DailyForecast[] = [];
  selectedLocation: Location = {
    Key: '215854',
    LocalizedName: 'Tel Aviv',
    Version: 1,
    Type: 'City',
    Rank: 10,
    Country: { ID: 'IL', LocalizedName: 'Israel' },
    AdministrativeArea: { ID: 'TA', LocalizedName: 'Tel Aviv' }
  };
  errorMessage: string | null = null;
  private unitChangeSubscription!: Subscription;
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  loadingWeather: boolean = true;
  loadingForecast: boolean;
  clothingRecommendation: string = '';
  isLoadingRecommendation: boolean = false;

  onLocationSelected(location: Location) {
    this.selectedLocation = location;
    this.loadWeather(location.Key);
  }

  constructor(
    private locationService: LocationService,
    public weatherService: WeatherService,
    private favoriteService: FavoritesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.filteredLocations = [{
      Key: '215854',
      LocalizedName: 'Tel Aviv',
      Version: 1,
      Type: 'City',
      Rank: 10,
      Country: { ID: 'IL', LocalizedName: 'Israel' },
      AdministrativeArea: { ID: 'TA', LocalizedName: 'Tel Aviv' }
    }];

    this.selectedLocation = this.filteredLocations[0];

    this.loadWeather('215854');

    this.unitChangeSubscription = this.weatherService.temperatureUnitChanged.subscribe(() => {
      this.loadWeather(this.selectedLocation.Key);
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((searchText) => {
        const englishOnlyRegex = /^[A-Za-z\s]+$/;

        if (!englishOnlyRegex.test(searchText)) {
          return of([]);
        }

        return this.locationService.getAutocompleteLocation(searchText).pipe(
          catchError(() => {
            this.snackBar.open('⚠️ Failed to fetch locations. Try again later!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['error-snackbar']
            });
            return of([]);
          })
        )
      })
    ).subscribe({
      next: (locations) => {
        this.filteredLocations = locations;
      }
    });
  }

  ngOnDestroy() {
    this.unitChangeSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.selectedLocation?.Key || '');
  }
  
  toggleFavorite(): void {
    if (!this.selectedLocation) return;
    if (this.favoriteService.isFavorite(this.selectedLocation.Key)) {
      this.favoriteService.removeFromFavorites(this.selectedLocation.Key);
    } else {
      this.favoriteService.addToFavorites(this.selectedLocation);
    }
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.searchSubject.next(this.searchText);
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

  onSelectLocation(location: Location) {
    this.selectedLocation = location;
    this.searchText = location.LocalizedName;
    this.loadWeather(location.Key);
  }

  fetchClothingRecommendation(temperature: number, condition: string) {
    this.isLoadingRecommendation = true;
    this.aiService.getClothingRecommendation(temperature, condition).subscribe({
      next: (response) => {
        this.clothingRecommendation = response[0].generated_text;
        this.isLoadingRecommendation = false;
      },
      error: () => {
        this.clothingRecommendation = '⚠️ Unable to fetch clothing recommendation.';
        this.isLoadingRecommendation = false;
      },
    });
  }

  loadWeather(locationKey: string): void {
    this.loadingWeather = true;
    this.loadingForecast = true;

    this.weatherService.getCurrentWeather(locationKey).pipe(
      finalize(() => this.loadingWeather = false)
    ).subscribe({
      next: (weather) => {
        this.currentWeather = weather;
      },
      error: () => {
        this.snackBar.open('⚠️ Unable to fetch weather data. Try again later!', 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    });

    this.weatherService.getForecast(locationKey).pipe(
      finalize(() => this.loadingForecast = false)
    ).subscribe({
      next: (forecast) => {
        this.forecastData = forecast.DailyForecasts;
      },
      error: () => {
        this.snackBar.open('⚠️ Unable to fetch forecast data. Try again later!', 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
