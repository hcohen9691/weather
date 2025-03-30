import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './weather/weather/pages/search/search.page';
import { FavoritesPage } from './weather/weather/pages/favorites/favorites.page';


const routes: Routes = [
  {
    path: 'search',
    component: SearchPage,
  },
  {
    path: 'search/:locationKey', 
    component: SearchPage,
  },
  { path: 'favorites', component: FavoritesPage },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
