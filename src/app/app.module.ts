import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { WeatherModule } from './weather/weather/weather.module';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    WeatherModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    MatSnackBarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
