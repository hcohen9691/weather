import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { WeatherService } from './core/services/weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  displayLoading: boolean = false;
  isDarkMode: boolean = false;
  isFavoritesPage: boolean = false;
    
  constructor(private loaderService: LoaderService, public weatherService: WeatherService) {
    this.checkIfFavoritesPage();
  }

  ngOnInit() {
    this.loaderService.stateChange.subscribe((loaderState) => {
      setTimeout(() => {
        this.displayLoading = loaderState;
      });
    });

    localStorage.setItem('darkMode', false.toString());
    this.updateDarkMode();
  }

  checkIfFavoritesPage() {
    return window.location.pathname.includes('favorites');
  }

  changeTemperatureUnit() {
    this.weatherService.isMetric = !this.weatherService.isMetric;

    this.weatherService.temperatureUnitChanged.next(this.weatherService.isMetric);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.updateDarkMode();
  }

  updateDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
