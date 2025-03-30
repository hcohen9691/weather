import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchPage } from './pages/search/search.page';
import { WeatherRoutingModule } from './weather-routing.module';

@NgModule({
  imports: [
    CommonModule,
    WeatherRoutingModule,
    SearchPage
    ],
})
export class WeatherModule {}
